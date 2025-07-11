from ultralytics import YOLO
model = YOLO("yolo12n.pt")
model.train(data="config.yaml", epochs=100)