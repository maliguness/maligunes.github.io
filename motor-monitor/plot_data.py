import csv
import matplotlib.pyplot as plt

timestamps = []
rpms = []
temperatures = []
vibrations = []
currents = []

with open("motor_data.csv", "r") as file:
    reader = csv.DictReader(file)

    for row in reader:
        timestamps.append(row["timestamp"])
        rpms.append(int(row["rpm"]))
        temperatures.append(float(row["temperature"]))
        vibrations.append(float(row["vibration"]))
        currents.append(float(row["current"]))

plt.figure()
plt.plot(timestamps, rpms)
plt.xlabel("Time")
plt.ylabel("RPM")
plt.title("Motor RPM Over Time")
plt.xticks(rotation=45)
plt.tight_layout()

plt.figure()
plt.plot(timestamps, temperatures)
plt.xlabel("Time")
plt.ylabel("Temperature (°C)")
plt.title("Motor Temperature Over Time")
plt.xticks(rotation=45)
plt.tight_layout()

plt.figure()
plt.plot(timestamps, vibrations)
plt.xlabel("Time")
plt.ylabel("Vibration (mm/s)")
plt.title("Motor Vibration Over Time")
plt.xticks(rotation=45)
plt.tight_layout()

plt.figure()
plt.plot(timestamps, currents)
plt.xlabel("Time")
plt.ylabel("Current (A)")
plt.title("Motor Current Over Time")
plt.xticks(rotation=45)
plt.tight_layout()

plt.show()