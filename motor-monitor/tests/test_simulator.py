from simulator import get_reading

EXPECTED_KEYS = {"rpm", "temperature", "vibration", "current", "state"}
VALID_STATES = {"STARTING", "RUNNING", "OVERLOAD", "FAULT"}


def test_reading_has_expected_keys():
    reading = get_reading()
    assert set(reading.keys()) == EXPECTED_KEYS


def test_reading_types():
    reading = get_reading()
    assert isinstance(reading["rpm"], int)
    assert isinstance(reading["temperature"], float)
    assert isinstance(reading["vibration"], float)
    assert isinstance(reading["current"], float)
    assert isinstance(reading["state"], str)


def test_reading_values_stay_in_range_over_full_cycle():
    # cycle resets every 55 calls (see simulator.py); run two full cycles
    for _ in range(110):
        reading = get_reading()

        assert 0 <= reading["rpm"] <= 3000
        assert 20 <= reading["temperature"] <= 100
        assert 0 <= reading["vibration"] <= 10
        assert 0 <= reading["current"] <= 15
        assert reading["state"] in VALID_STATES


def test_state_sequence_follows_expected_order():
    # cycle counter starts wherever the previous tests left it off, so read
    # until we see STARTING, then confirm the state machine's own ordering
    seen_states = []
    for _ in range(60):
        state = get_reading()["state"]
        if not seen_states or seen_states[-1] != state:
            seen_states.append(state)

    starting_index = seen_states.index("STARTING")
    ordered = seen_states[starting_index:]

    expected_order = ["STARTING", "RUNNING", "OVERLOAD", "FAULT"]
    assert ordered[: len(expected_order)] == expected_order
