# Import MatPlotLib
from matplotlib import style
style.use('fivethirtyeight')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

# Import Numpy and Pandas
import numpy as np
import pandas as pd

# Import DateTime
import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

# Import Flask
from flask import Flask, jsonify

###########################################################
# Database Setup
###########################################################
engine = create_engine("sqlite:///Resources/hawaii.sqlite")
connection = engine.connect()

# Declare bases and map class
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# view all of the classes
Base.classes.keys()

# Save references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station

###########################################################
# Flask setup
###########################################################
app = Flask(__name__)

###########################################################
# Flask Route
###########################################################
# Home page
# List all routes that are available
@app.route("/")
def home():
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start><br/>"
        f"/api/v1.0/<start>/<end>"
    )

# Convert the query results to a dictionary using date as the key and prcp as the value
# Return the JSON representation of your dictionary
@app.route("/api/v1.0/precipitation")
def precipitation():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # query results to a dictionary using date as the key and prcp as the value
    results = session.query(Measurement.date, Measurement.prcp).\
        filter(Measurement.date).\
        order_by(Measurement.date).all()

    session.close()

    # List date and precipitation
    all_date = []
    for date, prcp in results:
        measurement_dict = {}
        measurement_dict["date"] = date
        measurement_dict["precipitation"] = prcp
        all_date.append(measurement_dict)
    
    # Jsonify the data
    return jsonify(all_date)

# Return a JSON list of stations from the dataset
@app.route("/api/v1.0/stations")
def stations():
    session = Session(engine)

    # Query stations and order by descending by station
    results = session.query(Station.station).order_by(Station.station.desc()).all()

    session.close()

    # List stations
    all_station = []
    for station in results:
        station_dict = {}
        station_dict["station"] = station
        all_station.append(station_dict)

    # Jsonify the data
    return jsonify(all_station)

# Query the dates and temperature observations of the most active station for the last year of data
# Return a JSON list of temperature observations (TOBS) for the previous year
@app.route("/api/v1.0/tobs")
def tobs():
    session = Session(engine)

    # Calculate the previous year date from the last date in the SQL Table
    year_ago = dt.date(2017, 8, 23) - dt.timedelta(days=365)

    # Pull data for Date and Temperature for dates greater than one year ago and filter for the most active station
    # order by Temperature
    results = session.query(Measurement.date, Measurement.tobs).\
        filter(Measurement.date >= year_ago).\
        filter(Measurement.station == 'USC00519281').\
        order_by(Measurement.tobs).all()

    session.close()

    # List Date and Temperature
    year_temp = []
    for date, tobs in results:
        measurement_dict = {}
        measurement_dict["date"] = date
        measurement_dict["temp(F)"] = tobs
        year_temp.append(measurement_dict)

    # Jsonify the results
    return jsonify(year_temp)

# Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range
# When given the start only, calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date
@app.route("/api/v1.0/<start>")
def query_date(start):

    session = Session(engine)

    # Query Date and Temperature, order by date in descending order
    results = session.query(Measurement.date, Measurement.tobs).\
        order_by(Measurement.date.desc()).all()

    session.close()

    # Lowest temperature recorded from start date
    min_temp = session.query(func.min(Measurement.tobs)).filter(Measurement.date >= start).first()

    # Highest temperature recorded from start date
    max_temp = session.query(func.max(Measurement.tobs)).filter(Measurement.date >= start).first()

    # Average temperature from start date
    avg_temp = session.query(func.avg(Measurement.tobs)).filter(Measurement.date >= start).first()

    # List Min, Average, and Max temperature for the queried date
    for date, tobs in results:
        if date == start:
            measurement_dict = {}
            measurement_dict["min_temp(F)"] = min_temp
            measurement_dict["avg_temp(F)"] = avg_temp
            measurement_dict["max_temp(F)"] = max_temp
            # Jsonify the results
            return jsonify(measurement_dict)
    
    # Return an error reply if input is not in the table
    return jsonify({"error": f"Date {start} not found."}), 404

# When given the start and the end date, calculate the TMIN, TAVG, and TMAX for dates between the start and end date inclusive
@app.route("/api/v1.0/<start>/<end>")
def date_between(start, end):

    session = Session(engine)

    # Query Date and Temperature, order by date in descending order
    results = session.query(Measurement.date, Measurement.tobs).\
        order_by(Measurement.date.desc()).all()

    session.close()

    # Lowest temperature recorded from start date to end date
    min_temp = session.query(func.min(Measurement.tobs)).\
        filter(Measurement.date >= start).\
        filter(Measurement.date <= end).first()

    # Highest temperature recorded from start date to end date
    max_temp = session.query(func.max(Measurement.tobs)).\
        filter(Measurement.date >= start).\
        filter(Measurement.date <= end).first()

    # Average temperature from start date to end date
    avg_temp = session.query(func.avg(Measurement.tobs)).\
        filter(Measurement.date >= start).\
        filter(Measurement.date <= end).first()

    all_dates = session.query(Measurement.date).all()

    # List Min, Average, and Max temperature for the queried dates
    for date, tobs in results:
        if date == start:
            measurement_dict = {}
            measurement_dict["min_temp(F)"] = min_temp
            measurement_dict["avg_temp(F)"] = avg_temp
            measurement_dict["max_temp(F)"] = max_temp
            return jsonify(measurement_dict)

    # Return an error reply if input is not in the table
    return jsonify({"error": f"Date {start} not found."}), 404

if __name__ == "__main__":
    app.run(debug=True)