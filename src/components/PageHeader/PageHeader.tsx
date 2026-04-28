import { Box, Heading, Text } from '@chakra-ui/react';
import Colors from '../../constant/color';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => {
  return (
    <Box>
      <Heading size="lg" color={Colors.textPrimary}>
        {title}
      </Heading>

      {subtitle && (
        <Text color={Colors.textSecondary} mt={1}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
};

export default PageHeader;