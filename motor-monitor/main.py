from simulator import get_reading
import time
from datetime import datetime
import csv

from config import ALARM_THRESHOLDS

file = open("motor_data.csv", "a", newline="")
writer = csv.writer(file)

if file.tell() == 0:
    writer.writerow([
        "timestamp",
        "rpm",
        "temperature",
        "vibration",
        "current",
        "alarm"
    ])

try:
    while True:
        reading = get_reading()
        timestamp = datetime.now().strftime("%H:%M:%S")

        alarms = []

        if reading["temperature"] > ALARM_THRESHOLDS.temperature:
            alarms.append("HIGH TEMPERATURE")

        if reading["vibration"] > ALARM_THRESHOLDS.vibration:
            alarms.append("HIGH VIBRATION")

        if reading["current"] > ALARM_THRESHOLDS.current:
            alarms.append("HIGH CURRENT")

        for alarm in alarms:
            print(f"WARNING: {alarm}")

        writer.writerow([
            timestamp,
            reading["rpm"],
            reading["temperature"],
            reading["vibration"],
            reading["current"],
            " | ".join(alarms)
        ])

        file.flush()

        print(
            f'{timestamp} | '
            f'State: {reading["state"]} | '
            f'RPM: {reading["rpm"]} | '
            f'Temp: {reading["temperature"]} °C | '
            f'Vibration: {reading["vibration"]} mm/s | '
            f'Current: {reading["current"]} A'
        )

        time.sleep(1)

except KeyboardInterrupt:
    file.close()
    print("\nMonitoring stopped.")

