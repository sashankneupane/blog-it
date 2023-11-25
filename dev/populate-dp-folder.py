import os
import shutil
import requests
from dotenv import load_dotenv
import pymongo

load_dotenv()

# MongoDB connection
uri = os.environ.get("DSN")
client = pymongo.MongoClient(uri)
db = client[os.environ.get("DB_NAME")]

# Unsplash API key
unsplash_access_key = os.environ.get("UNSPLASH_ACCESS_KEY")

# Destination folder for profile pictures
destination_folder = '../public/img/dp'

# Ensure the destination folder exists, create it if necessary
os.makedirs(destination_folder, exist_ok=True)

# Function to download a random image from Unsplash for each user
def download_image_for_user(user_id):
    try:
        # Make a request to the Unsplash API to get a random photo
        response = requests.get(
            'https://api.unsplash.com/photos/random',
            params={
                'client_id': unsplash_access_key,
                'query': 'anime',
            }
        )

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Extract the image URL from the JSON response
            image_url = response.json()['urls']['regular']

            # Save the image to the destination folder
            destination_file_path = os.path.join(destination_folder, f'{user_id}.png')
            with open(destination_file_path, 'wb') as f:
                f.write(requests.get(image_url).content)

            print(f'Image downloaded for user {user_id}')
        else:
            print(f'Error fetching image from Unsplash. Status code: {response.status_code}')

    except Exception as e:
        print(f'Error: {e}')

# Get all user IDs from the database
users = [user for user in db['users'].find({}, {'_id': 1, 'username': 1})]

# Loop through each user ID and download a random image from Unsplash
for user in users:
    download_image_for_user(user['_id'])

print('All images downloaded successfully.')
