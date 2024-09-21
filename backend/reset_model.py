import os
import json
import shutil
import logging

logging.basicConfig(level=logging.DEBUG)

def reset_model():
    try:
        # 1. Delete all images in the 'images' directory
        images_dir = './images'
        if os.path.exists(images_dir):
            shutil.rmtree(images_dir)
            os.makedirs(images_dir)
            logging.info("Images directory cleared and recreated.")
        else:
            logging.info("Images directory doesn't exist. Creating it.")
            os.makedirs(images_dir)

        # 2. Clear the names.json file
        names_file = 'names.json'
        if os.path.exists(names_file):
            with open(names_file, 'w') as f:
                json.dump({}, f)
            logging.info("names.json file cleared.")
        else:
            logging.info("names.json file doesn't exist. Creating an empty one.")
            with open(names_file, 'w') as f:
                json.dump({}, f)

        # 3. Delete the trainer.yml file
        trainer_file = 'trainer.yml'
        if os.path.exists(trainer_file):
            os.remove(trainer_file)
            logging.info("trainer.yml file deleted.")
        else:
            logging.info("trainer.yml file doesn't exist. No action needed.")

        return True, "Model reset successfully."
    except Exception as e:
        logging.error(f"Error resetting model: {str(e)}")
        return False, f"Error resetting model: {str(e)}"

if __name__ == "__main__":
    success, message = reset_model()
    print(message)