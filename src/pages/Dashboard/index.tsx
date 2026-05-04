import { useEffect } from 'react';
import { Box, Grid, GridItem, Skeleton } from '@chakra-ui/react';
import {
  FaFileInvoice,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExchangeAlt,
  FaUndoAlt,
} from 'react-icons/fa';
import StatsCard from '../../components/StatsCard/StatsCard';
import WelcomeCard from '../../components/WelcomeCard/WelcomeCard';
import Colors from '../../constant/color';
import { useAppSelector, useAppDispatch } from '../../config/hook';
import { getDashboardSummaryApi } from '../../features/dashboard/DashboardService';
import { setDashboardLoading, setDashboardSummary } from '../../features/dashboard/DashboardSlice';
import { formatRupiah } from '../../utils/validation';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { summary, isLoading } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    dispatch(setDashboardLoading(true));
    getDashboardSummaryApi(controller.signal)
      .then((data) => {
        if (cancelled) return;
        dispatch(setDashboardSummary(data));
      })
      .catch(() => {
        if (cancelled) return;
      })
      .finally(() => {
        if (!cancelled) dispatch(setDashboardLoading(false));
      });

    return () => { cancelled = true; controller.abort(); };
  }, [dispatch]);

  const stats = [
    {
      icon: <FaFileInvoice />,
      label: 'Total Invoice',
      value: summary?.total_invoice ?? 0,
      bgColor: Colors.primary,
      iconBg: '#3B82F615',
    },
    {
      icon: <FaCheckCircle />,
      label: 'Total Paid',
      value: summary?.total_paid ?? 0,
      bgColor: Colors.success,
      iconBg: '#10B98115',
    },
    {
      icon: <FaTimesCircle />,
      label: 'Total Failed',
      value: summary?.total_failed ?? 0,
      bgColor: Colors.danger,
      iconBg: '#EF444415',
    },
    {
      icon: <FaClock />,
      label: 'Total Expired',
      value: summary?.total_expired ?? 0,
      bgColor: Colors.warning,
      iconBg: '#F59E0B15',
    },
    {
      icon: <FaExchangeAlt />,
      label: 'Total Nominal Transaksi',
      value: formatRupiah(Number(summary?.total_paid_amount ?? 0)),
      bgColor: Colors.info,
      iconBg: '#06B6D415',
    },
    {
      icon: <FaUndoAlt />,
      label: 'Total Refund',
      value: formatRupiah(Number(summary?.total_refund_amount ?? 0)),
      bgColor: Colors.success,
      iconBg: '#10B98115',
    },
  ];

  return (
    <Box w="100%">
      <WelcomeCard userName={user?.name} />

      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
        gap={6}
        mb={8}
      >
        {stats.map((stat) => (
          <GridItem key={stat.label}>
            {isLoading ? (
              <Skeleton height="100px" borderRadius="12px" />
            ) : (
              <StatsCard
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                bgColor={stat.bgColor}
                iconBg={stat.iconBg}
              />
            )}
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
