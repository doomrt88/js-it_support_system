import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar';
import IssueList from '../Boards/IssueList';
import { Pie, Bar  } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale,  LinearScale} from 'chart.js';
import axios from '../../axios_interceptor';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Home = () => {
 
  const [totalIssues, setTotalIssues] = useState(0);
  const [openIssues, setOpenIssues] = useState(0);
  const [closedIssues, setClosedIssues] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [chartData, setChartData] = useState({});
  const [priorityChartData, setPriorityChartData] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [totalResponse, openResponse, closedResponse, inProgressResponse, priorityDataResponse] = await Promise.all([
        axios.get('/dashboard-total-issues'),
        axios.get('/dashboard-open-issues'),
        axios.get('/dashboard-closed-issues'),
        axios.get('/dashboard-in-progress-issues'),
        axios.get('/dashboard-priority')
      ]);
  
      // setTotalIssues(totalResponse.data.total);
      // setOpenIssues(openResponse.data.total);
      // setClosedIssues(closedResponse.data.total);
      setChartData({
        labels: ['Total Issues', 'Open Issues', 'In Progress Issues', 'Closed Issues'],
        datasets: [
          {
            label: 'Number of Issues',
            backgroundColor: ['#007bff', '#28a745', '#dc3545'],
            borderColor: ['#007bff', '#28a745', '#dc3545'],
            borderWidth: 1,
            hoverBackgroundColor: ['#0056b3', '#218838', '#c82333'],
            hoverBorderColor: ['#0056b3', '#218838', '#c82333'],
            data: [totalResponse.data.total, openResponse.data.total, inProgressResponse.data.total, closedResponse.data.total],
          },
        ],
      });

      const priorityData = priorityDataResponse?.data;
      const priorityChartData = {
        labels: ['P1', 'P2', 'P3', 'P4', 'P5'],
        datasets: [
          {
            label: 'Number of Issues by Priority',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
            data: [
              priorityData.find(item => item._id === 1)?.count || 0,
              priorityData.find(item => item._id === 2)?.count || 0,
              priorityData.find(item => item._id === 3)?.count || 0,
              priorityData.find(item => item._id === 4)?.count || 0,
              priorityData.find(item => item._id === 5)?.count || 0,
            ],
          },
        ],
      };

      setPriorityChartData(priorityChartData);
      setDataLoaded(true);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="container mt-4 text-center">
        <h1>Dashboard</h1>
        <div className="row mt-4 justify-content-center">
          {dataLoaded && (
            <div className="col-md-6">
              <h4 className="mb-3">All Issues</h4>
              <Bar
                data={chartData}
              />
            </div>
          )}
        </div>
        <div className="row justify-content-center mt-5">
          {dataLoaded && (
            <div className="col-md-6">
              <h4 className="mb-3">Priority Distribution</h4>
              <Pie
                data={priorityChartData}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
