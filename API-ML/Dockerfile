FROM python:3.9-bullseye

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

COPY Model.h5 .

COPY Model2.h5 .

COPY fbaccount.json .

COPY gcsaccount2.json .

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app