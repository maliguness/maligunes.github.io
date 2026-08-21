# Motor Monitoring Dashboard

A simulated electric motor monitoring system: generates realistic sensor
data (RPM, temperature, vibration, current), logs it to CSV, raises
threshold alarms, and visualizes it live in a web dashboard.

Built as a learning project — the simulator models a motor moving through
states (`STARTING` → `RUNNING` → `OVERLOAD` → `FAULT`) with values easing
toward targets over time, instead of pure random noise. This mirrors how
you'd later swap in real sensor input from an Arduino/ESP32 without
changing the rest of the pipeline.

## Files

| File | Purpose |
|---|---|
| `simulator.py` | Generates one motor reading per call (`get_reading()`), driven by an internal state machine |
| `main.py` | Runs the monitoring loop: reads a sample every second, logs it to `motor_data.csv`, prints alarms |
| `dashboard.py` | Streamlit web dashboard — live metrics and charts, refreshes every second |
| `plot_data.py` | Matplotlib plots of the full CSV history (RPM, temperature, vibration, current over time) |
| `motor_data.csv` | Logged readings (generated at runtime, not source code) |

## Setup

```bash
pip install -r requirements.txt
```

## Run

Start the logger (run this first — it creates/appends `motor_data.csv`):

```bash
python3 main.py
```

Stop with `Ctrl+C`.

In another terminal, view the live dashboard:

```bash
streamlit run dashboard.py
```

Or plot the collected history after stopping the logger:

```bash
python3 plot_data.py
```

## Alarms

Printed to the console and logged in the CSV `alarm` column:

- Temperature > 80 °C
- Vibration > 8 mm/s
- Current > 13 A

## Roadmap

- [ ] Replace `simulator.py` with real sensor input (Arduino/ESP32 over serial)
- [ ] Unit tests for the simulator's state transitions
- [ ] Config file for alarm thresholds instead of hardcoded values
