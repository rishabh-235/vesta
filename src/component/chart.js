import React, { Component } from "react";
import axios from "axios";
import Chart from "react-apexcharts";

class chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          id: "areachart-2",
        },
        xaxis: {
          categories: [],
        },
      },
      stroke: {
        curve: "straight",
      },
      series: [
        {
          name: "Requests",
          data: [],
        },
      ],

      totalFrequency: 0,
      departments: [],
    };
  }

  async componentDidMount() {
    const response = await axios.get("https://checkinn.co/api/v1/int/requests");
    this.setState({ requests: response.data.requests });

    const categoryFrequencyMap = new Map();
    const uniquedepartments = new Map();
    let frequencie = 0;

    response.data.requests.forEach((request) => {

      const category = request.hotel.shortname;
      const department = request.desk.name;
      uniquedepartments.set(department, 1);
      frequencie++;

      if (categoryFrequencyMap.has(category)) {
        categoryFrequencyMap.set(
          category,
          categoryFrequencyMap.get(category) + 1
        );
      } else {
        categoryFrequencyMap.set(category, 1);
      }
    });

    const categories = Array.from(categoryFrequencyMap.keys());
    const frequencies = Array.from(categoryFrequencyMap.values());
    this.setState({ departments: Array.from(uniquedepartments.keys()) });
    this.setState({totalFrequency: frequencie});

    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        xaxis: {
          ...prevState.options.xaxis,
          categories: categories,
        },
      },
    }));

    this.setState((prevState) => ({
      series: [
        {
          ...prevState.series[0],
          data: frequencies,
        },
      ],
    }));
  }

  render() {
    return (
      <div className="container">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="line"
          width={800}
          height={400}
        />

        <div>Total Requests: {this.state.totalFrequency}</div>

        <div>
          List of unique department names across all Hotels:
          {this.state.departments.map((request,index) => (
            <span key={index}>
              {request}, 
            </span>
          ))}
        </div>
      </div>
    );
  }
}

export default chart;
