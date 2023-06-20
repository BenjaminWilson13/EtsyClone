import boto3, botocore
import os
from werkzeug.utils import secure_filename
import uuid

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
)

def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

def upload_file_to_s3(file, acl="public-read"):
    filename = secure_filename(file.filename)
    try:
        s3.upload_fileobj(
            file,
            os.getenv("AWS_BUCKET_NAME"),
            filename,
            ExtraArgs={
                "ACL": acl,
                "ContentType": file.content_type
            }
        )

    except Exception as e:
    # This is a catch all exception.
        print("Something Happened: ", e)
        return e


    # After uploading file to s3 bucket, return filename
    return file.filename


def remove_file_from_s3(image_url):
    # AWS needs the image file name, not the URL, 
    # so we split that out of the URL
    key = image_url.rsplit("/", 1)[1]
    print(key)
    try:
        s3.delete_object(
        Bucket=os.getenv("AWS_BUCKET_NAME"),
        Key=key
        )
    except Exception as e:
        return { "errors": str(e) }
    return True