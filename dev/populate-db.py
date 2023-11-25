import os
import random
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()

import pymongo
from faker import Faker
from urllib.parse import quote

uri = os.environ.get("DSN")
client = pymongo.MongoClient(uri)
db = client[os.environ.get("DB_NAME")]

fake = Faker()

# Clear all collections
db["tags"].delete_many({})
db["users"].delete_many({})
db["blogposts"].delete_many({})
db["comments"].delete_many({})
db["likes"].delete_many({})
db["followings"].delete_many({})

# Insert tags into the database
fixed_tags = set()
tags = []

while len(fixed_tags) < 100:
    tag = fake.word()
    if tag not in fixed_tags:
        fixed_tags.add(tag)
        tags.append({"name": tag})

db["tags"].insert_many(tags)

# Function to generate random data for the User schema
def generate_user():
    return {
        "username": fake.user_name(),
        "email": fake.email(),
        "password": fake.password(),
        "name": fake.name(),
    }

# Function to generate random data for the BlogPost schema
def generate_blog_post(users, tags):
    user = random.choice(users)
    num_tags = random.randint(2, 4)
    post_tags = random.sample(tags, num_tags)

    return {
        "title": fake.sentence(),
        "content": fake.paragraph() + '\n' + fake.paragraph() + '\n' + fake.paragraph(),
        "author": user["_id"],
        "tags": [tag["_id"] for tag in post_tags],
        "publicationDate": datetime.now(),
        "lastUpdated": datetime.now(),
    }

# Function to generate random data for the Comment schema
def generate_comment(users, author_id):
    user = random.choice(users)
    return {
        "user": user["_id"],
        "blogPost": author_id,
        "text": fake.sentence(),
        "createdAt": datetime.now(),
    }

# Function to generate random data for the Like schema
def generate_like(users, author_id):
    user = random.choice(users)
    return {
        "user": user["_id"],
        "blogPost": author_id,
        "createdAt": datetime.now(),
    }

# Function to generate random data for the Following schema
def generate_following(users):
    follower = random.choice(users)
    following = random.choice(users)
    while follower["_id"] == following["_id"]:
        following = random.choice(users)
    return {
        "follower": follower["_id"],
        "following": following["_id"],
        "createdAt": datetime.now(),
    }

# Generate and insert data
num_users = 20
num_tags = 100
num_blog_posts = 100

users = [generate_user() for _ in range(num_users)]
users.append({
    "username": "admin",
    "email": "admin@gmail.com",
    "password": "admin",
    "name": "Admin",
})
user_ids = db["users"].insert_many(users).inserted_ids

blog_posts = [generate_blog_post(users, tags) for _ in range(num_blog_posts)]
blog_post_ids = db["blogposts"].insert_many(blog_posts).inserted_ids

followings = [generate_following(users) for _ in range(num_users * 2)]
following_ids = db["followings"].insert_many(followings).inserted_ids

likes = [generate_like(users, blog_post_ids[i]) for i in range(num_blog_posts)]
like_ids = db["likes"].insert_many(likes).inserted_ids

comments = [generate_comment(users, blog_post_ids[i]) for i in range(num_blog_posts)]
comment_ids = db["comments"].insert_many(comments).inserted_ids

print("Database populated with random data.")