import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Heading, Text, Flex } from "@chakra-ui/react";
import { Chart } from "chart.js/auto";
import { Button } from "@chakra-ui/react";

const Dashboard = () => {
  const [loggedInUsers, setLoggedInUsers] = useState(0);
  const [timeSpentChatting, setTimeSpentChatting] = useState(0);
  const loggedInUsersChartRef = useRef(null);
  const timeSpentChattingChartRef = useRef(null);

  useEffect(() => {
    const fetchLoggedInUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const numLoggedInUsers = Math.floor(Math.random() * 50); // Generate a random number of logged in users
      setLoggedInUsers(numLoggedInUsers);
    };

    const fetchTimeSpentChatting = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const timeSpent = Math.floor(Math.random() * 180); // Generate a random value for time spent chatting
      setTimeSpentChatting(timeSpent);
    };

    fetchLoggedInUsers();
    fetchTimeSpentChatting();
  }, []);

  useEffect(() => {
    // Create the chart for Logged-In Users
    const loggedInUsersChartCtx = document
      .getElementById("loggedInUsersChart")
      .getContext("2d");
    loggedInUsersChartRef.current = new Chart(loggedInUsersChartCtx, {
      type: "bar",
      data: {
        labels: ["Logged-In Users"],
        datasets: [
          {
            label: "Number of Logged-In Users",
            data: [loggedInUsers],
            backgroundColor: "#3182CE",
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: loggedInUsers + 5, // Adjust the max value as needed
          },
        },
      },
    });

    // Create the chart for Time Spent Chatting
    const timeSpentChattingChartCtx = document
      .getElementById("timeSpentChattingChart")
      .getContext("2d");
    timeSpentChattingChartRef.current = new Chart(timeSpentChattingChartCtx, {
      type: "doughnut",
      data: {
        labels: ["Time Spent Chatting"],
        datasets: [
          {
            label: "Time Spent Chatting",
            data: [timeSpentChatting],
            backgroundColor: ["#38A169", "#ED8936"],
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "70%",
      },
    });

    // Clean up
    return () => {
      loggedInUsersChartRef.current.destroy();
      timeSpentChattingChartRef.current.destroy();
    };
  }, [loggedInUsers, timeSpentChatting]);

  const handleReportSubmit = () => {
    // Handle the report submission logic here
  };

  return (
    <Container maxW="xl" centerContent>
      <Heading as="h2" size="lg" mt={10} mb={6}>
        Dashboard
      </Heading>
      <Flex justifyContent="space-between">
        <Box p={6} borderWidth={1} borderRadius="md" w="48%">
          <Heading as="h3" size="md" mb={4}>
            Logged-In Users
          </Heading>
          <canvas id="loggedInUsersChart" height="300"></canvas>
          <Text textAlign="center" mt={4}>
            Number of Logged-In Users: {loggedInUsers}
          </Text>
        </Box>
        <Box p={6} borderWidth={1} borderRadius="md" w="48%">
          <Heading as="h3" size="md" mb={4}>
            Time Spent Chatting
          </Heading>
          <canvas id="timeSpentChattingChart" height="300"></canvas>
          <Text textAlign="center" mt={4}>
            Time Spent Chatting: {timeSpentChatting} minutes
          </Text>
        </Box>
      </Flex>
      <Box mt={6} p={6} borderWidth={1} borderRadius="md" w="100%">
        <Heading as="h2" size="lg" mb={6}>
          Report a Problem
        </Heading>
        <Text mb={6}>
          Please provide details about the issue you encountered. Our team will
          review it as soon as possible.
        </Text>
        <Button colorScheme="blue" onClick={handleReportSubmit}>
          Submit Report
        </Button>
      </Box>
    </Container>
  );
};

export default Dashboard;
