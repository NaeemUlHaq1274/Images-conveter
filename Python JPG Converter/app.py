from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import io
from MySQL_Connection import mysqlConnection
import zipfile
from datetime import datetime, timedelta
import pytz  # for timezone handling


app = Flask(__name__)
cors = CORS(app)


@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image' in request.files and 'imgName' in request.form:
        uploaded_image = request.files['image']
        img_format = request.form.get('format')
        img_name = request.form.get('imgName')

        try:
            img = Image.open(uploaded_image)

            # Convert the image to the specified format
            converted_image = io.BytesIO()
            img.save(converted_image, format=img_format)
            converted_image_data = converted_image.getvalue()
            converted_image.close()

            # Get the current time with timezone information (e.g., UTC)
            current_time = datetime.now(pytz.utc)
            current_time_str = current_time.strftime("%Y-%m-%d %H:%M:%S.%f")

            mysql_connection = mysqlConnection()
            cursor = mysql_connection.cursor()

            cursor.execute("INSERT INTO images (data, name, timestamp) VALUES (%s, %s, %s)", (converted_image_data, img_name, current_time_str))
            mysql_connection.commit()

            image_id = cursor.lastrowid

            mysql_connection.close()

            return jsonify({"id": image_id}), 200
        except Exception as e:
            print("Error:", e)
            return jsonify({"error": str(e)}), 404
    else:
        return jsonify({"error": "Missing 'image' or 'imgName' in the request."})

@app.route('/download_single_image/<int:image_id>', methods=['GET'])
def download_image(image_id):
    mysql_connection = mysqlConnection()
    cursor = mysql_connection.cursor()

    cursor.execute("SELECT data, name, timestamp FROM images WHERE id = %s", (image_id,))
    row = cursor.fetchone()

    if row:
        image_data, img_name, timestamp = row

        if image_data:
            # Convert the timestamp string to a datetime object
            timestamp = datetime.strptime(str(timestamp), "%Y-%m-%d %H:%M:%S.%f")
            
            # Make sure the timestamp is in the correct timezone (e.g., UTC)
            timestamp = pytz.utc.localize(timestamp)

            # Calculate the time difference between the current time and the image's timestamp
            current_time = datetime.now(pytz.utc)
            time_difference = current_time - timestamp

            # Define the maximum allowed age for an image in hours
            max_age_hours = 1

            if time_difference <= timedelta(hours=max_age_hours):
                response = send_file(io.BytesIO(image_data), as_attachment=True, download_name=img_name)
                return response
            else:
                return jsonify({"error": "Image is too old to download"})
        else:
            return jsonify({"error": "Image data is empty"})
    else:
        return jsonify({"error": "Image not found"})


@app.route('/download_multiple_images', methods=['GET'])
def download_images():
    mysql_connection = mysqlConnection()
    cursor = mysql_connection.cursor()

    # Get a list of image IDs from the request query parameters (e.g., ?image_ids=1,2,3).
    image_ids = request.args.get('image_ids')
    image_ids = [int(image_id) for image_id in image_ids.split(',')]

    # Create a temporary zip file to store the images.
    zip_filename = 'images.zip'
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for image_id in image_ids:
            cursor.execute("SELECT data, name, timestamp FROM images WHERE id = %s", (image_id,))
            row = cursor.fetchone()

            if row:
                image_data, img_name, timestamp = row
                if image_data:
                    # Convert the timestamp string to a datetime object
                    timestamp = datetime.strptime(str(timestamp), "%Y-%m-%d %H:%M:%S.%f")
                    timestamp = pytz.utc.localize(timestamp)

                    # Calculate the time difference between the current time and the image's timestamp
                    current_time = datetime.now(pytz.utc)
                    time_difference = current_time - timestamp

                    # Define the maximum allowed age for an image in hours
                    max_age_hours = 1

                    if time_difference <= timedelta(hours=max_age_hours):
                        zipf.writestr(img_name, image_data)
                    else:
                        return jsonify({"error": "One or more images are too old to download"})

    mysql_connection.close()

    # Send the zip file as a download.
    return send_file(zip_filename, as_attachment=True, download_name='images.zip')


if __name__ == '__main__':
    app.run(debug=True)
