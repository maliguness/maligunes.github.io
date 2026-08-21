import random

rpm = 0
temperature = 25.0
vibration = 0.5
current = 0.0

state = "STARTING"
cycle = 0


def get_reading():
    global rpm, temperature, vibration, current, state, cycle

    cycle += 1

    # Motor çalışma durumunu zamanla değiştir
    if cycle < 10:
        state = "STARTING"
    elif cycle < 30:
        state = "RUNNING"
    elif cycle < 45:
        state = "OVERLOAD"
    elif cycle < 55:
        state = "FAULT"
    else:
        cycle = 0
        state = "STARTING"

    # STARTING
    if state == "STARTING":
        rpm += random.randint(150, 300)
        current += random.uniform(0.5, 1.0)

    # RUNNING
    elif state == "RUNNING":
        rpm += random.randint(-100, 100)

        target_current = 6.0 + (rpm / 3000) * 3
        current += (target_current - current) * 0.2

    # OVERLOAD
    elif state == "OVERLOAD":
        rpm += random.randint(-80, 50)

        target_current = 13.5
        current += (target_current - current) * 0.25

    # FAULT
    elif state == "FAULT":
        rpm += random.randint(-150, 150)

        target_current = 8.0
        current += (target_current - current) * 0.2

    rpm = max(0, min(3000, rpm))
    current = max(0, min(15, current))

    # Temperature
    target_temperature = 25 + current * 3.5

    if state == "OVERLOAD":
        target_temperature += 15

    temperature += (target_temperature - temperature) * 0.08
    temperature += random.uniform(-0.2, 0.2)
    temperature = max(20, min(100, temperature))

    # Vibration
    target_vibration = 1.0 + (rpm / 3000) * 3

    if state == "FAULT":
        target_vibration = 9.0

    vibration += (target_vibration - vibration) * 0.25
    vibration += random.uniform(-0.3, 0.3)
    vibration = max(0, min(10, vibration))

    return {
        "rpm": int(rpm),
        "temperature": round(temperature, 1),
        "vibration": round(vibration, 1),
        "current": round(current, 1),
        "state": state
    }


if __name__ == "__main__":
    for _ in range(60):
        print(get_reading())
