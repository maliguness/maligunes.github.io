import pandas as pd
import streamlit as st

st.set_page_config(
    page_title="Motor Monitoring Dashboard",
    layout="wide"
)

st.title("Motor Monitoring Dashboard")


@st.fragment(run_every="1s")
def live_dashboard():

    data = pd.read_csv("motor_data.csv")

    latest = data.iloc[-1]

    col1, col2, col3, col4 = st.columns(4)

    col1.metric("RPM", int(latest["rpm"]))
    col2.metric("Temperature", f'{latest["temperature"]} °C')
    col3.metric("Vibration", f'{latest["vibration"]} mm/s')
    col4.metric("Current", f'{latest["current"]} A')

    st.subheader("Motor Status")

    if pd.isna(latest["alarm"]) or latest["alarm"] == "":
        st.success("NORMAL")
    else:
        st.error(latest["alarm"])

    st.subheader("Temperature")
    st.line_chart(data, x="timestamp", y="temperature")

    st.subheader("RPM")
    st.line_chart(data, x="timestamp", y="rpm")

    st.subheader("Vibration")
    st.line_chart(data, x="timestamp", y="vibration")

    st.subheader("Current")
    st.line_chart(data, x="timestamp", y="current")
    st.write("Last update:", pd.Timestamp.now())


live_dashboard()