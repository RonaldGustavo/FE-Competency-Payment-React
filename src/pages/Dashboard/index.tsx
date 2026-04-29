import { Box, Grid, GridItem } from '@chakra-ui/react';
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
import { useAppSelector } from '../../config/hook';

const Dashboard = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <Box w="100%">
      <WelcomeCard userName={user?.name} />

      <Grid
        templateColumns={{
          base: '1fr',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={6}
        mb={8}
      >
        <GridItem>
          <StatsCard
            icon={<FaFileInvoice />}
            label="Total Invoice"
            value="44"
            change={{ value: 12.5, isPositive: true }}
            bgColor={Colors.primary}
            iconBg="#3B82F615"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaCheckCircle />}
            label="Total Paid"
            value="71"
            change={{ value: 12.5, isPositive: true }}
            bgColor={Colors.success}
            iconBg="#10B98115"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaTimesCircle />}
            label="Total Failed"
            value="90"
            change={{ value: 12.5, isPositive: true }}
            bgColor={Colors.danger}
            iconBg="#EF444415"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaClock />}
            label="Total Expired"
            value="120"
            change={{ value: 12.5, isPositive: false }}
            bgColor={Colors.warning}
            iconBg="#F59E0B15"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaExchangeAlt />}
            label="Total Nominal Transaksi"
            value="$45,231"
            change={{ value: 8.2, isPositive: true }}
            bgColor={Colors.info}
            iconBg="#06B6D415"
          />
        </GridItem>

        <GridItem>
          <StatsCard
            icon={<FaUndoAlt />}
            label="Total Refund"
            value="$125,231"
            change={{ value: 2.4, isPositive: true }}
            bgColor={Colors.success}
            iconBg="#10B98115"
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;
