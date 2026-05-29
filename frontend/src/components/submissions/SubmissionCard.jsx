import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Chip,
  Box,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'warning', icon: <EditNoteIcon fontSize="small" /> },
  completed: {
    label: 'Completed',
    color: 'success',
    icon: <CheckCircleOutlineIcon fontSize="small" />,
  },
};

const SubmissionCard = ({ submission, onClick }) => {
  const { title, status, progress, totalSteps, updatedAt } = submission;
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  const pct = totalSteps > 0 ? Math.round((progress / totalSteps) * 100) : 0;

  return (
    <Card
      sx={{
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 4px 16px rgba(13,115,119,0.12)' },
      }}
    >
      <CardActionArea onClick={onClick} sx={{ p: 0 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
              {title}
            </Typography>
            <Chip
              icon={statusCfg.icon}
              label={statusCfg.label}
              color={statusCfg.color}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" fontWeight={600} color="primary">
                {progress} / {totalSteps} steps
              </Typography>
            </Box>
            <Tooltip title={`${pct}% complete`} placement="top">
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { borderRadius: 3 },
                }}
              />
            </Tooltip>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Updated {dayjs(updatedAt).fromNow()}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default SubmissionCard;
