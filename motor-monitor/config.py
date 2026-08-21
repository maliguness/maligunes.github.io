from dataclasses import dataclass


@dataclass(frozen=True)
class SensorRanges:
    rpm_min: int = 0
    rpm_max: int = 3000
    temperature_min: float = 20.0
    temperature_max: float = 100.0
    vibration_min: float = 0.0
    vibration_max: float = 10.0
    current_min: float = 0.0
    current_max: float = 15.0


@dataclass(frozen=True)
class AlarmThresholds:
    temperature: float = 80.0
    vibration: float = 8.0
    current: float = 13.0


RANGES = SensorRanges()
ALARM_THRESHOLDS = AlarmThresholds()
