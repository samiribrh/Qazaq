import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

const AiReportPage = ({ open, setOpen, telemetryId }) => {
  const [aiPrediction, setAiPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch AI prediction data when telemetryId is set
  useEffect(() => {
    if (telemetryId && open) {
      const fetchAiPrediction = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            `http://localhost:8000/api/v1/ai/predict`,
            {}, // Empty body for the POST request
            { params: { telemetry_id: telemetryId } } // Pass telemetryId as query params
          );
          setAiPrediction(response.data);
          setError('');
        } catch (err) {
          setError('Failed to fetch AI prediction. Please try again.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchAiPrediction();
    }
  }, [telemetryId, open]);

  const handleClose = () => {
    setOpen(false);
    setAiPrediction(null);
    setError('');
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            padding: 5,
          }}
        >
          <Typography variant="h5" gutterBottom>
            AI Prediction Report
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : aiPrediction ? (
            <Box>
              <Typography variant="h6">Device Information:</Typography>
              <Typography>Device ID: {aiPrediction.data?.device_id}</Typography>
              <Typography>Field ID: {aiPrediction.data?.field_id}</Typography>

              <Typography variant="h6" sx={{ mt: 3 }}>
                Reports:
              </Typography>
              {aiPrediction.data?.reports?.length > 0 ? (
                aiPrediction.data.reports.map((report, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography>Crop Name: {report.crop_name}</Typography>
                    <Typography>Probability: {report.probability}</Typography>
                    <Typography>Created At: {new Date(report.created_at).toLocaleString()}</Typography>
                    <Typography>Updated At: {new Date(report.updated_at).toLocaleString()}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No reports available.</Typography>
              )}
            </Box>
          ) : (
            <Typography>No prediction data available.</Typography>
          )}
        </Box>
      </Fade>
    </Modal>
  );
};

export default AiReportPage;
