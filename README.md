# EcoSort
It's designed to promote eco-friendly waste disposal through smart technology.












🧩 1. Use djongo or mongoengine to connect Django to MongoDB
✅ Option A: djongo (if you're using Django ORM)
pip install djongo


Then in your settings.py:
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'your_db_name',
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': 'mongodb://localhost:27017'

  }
    }
}
