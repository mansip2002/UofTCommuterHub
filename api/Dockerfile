# docker build . -t capstone-server
# docker run -p 5000:5000 capstone-server

FROM python:3.12.2
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
EXPOSE 5000
CMD ["python", "app.py"]
