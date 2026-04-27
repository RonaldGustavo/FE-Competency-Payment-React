import React, { useRef, useEffect, useState } from 'react';
import { Box, Flex, Heading, Text, IconButton } from '@chakra-ui/react';

import {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuPositioner,
} from '@chakra-ui/react/menu';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { RiLoginBoxLine } from 'react-icons/ri';
import { FaBars, FaUserCircle } from 'react-icons/fa';

import Footer from '../Footer/Footer';
import { useAppDispatch } from '../../config/hook';
import { logout } from '../../features/auth/AuthSlice';
import { getCookie } from '../../utils/cookieHelper';
import useDeviceType from '../../utils/useDeviceType';
import Colors from '../../constant/color';

function PageBase(): React.JSX.Element {
  const { isMobile } = useDeviceType();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [manualToggle, setManualToggle] = useState(false);

  const isSidebarOpen = isMobile ? manualToggle : true;
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = getCookie('auth-user');
      if (!token) {
        dispatch(logout());
        navigate('/sign-in');
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate, dispatch]);

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  const toggleSidebar = () => {
    setManualToggle((p) => !p);
  };

  const breadcrumb = pathname
    .split('/')
    .filter(Boolean)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' / ');

  return (
    <Flex h="100vh" bg={Colors.bgPrimary}>
      <Box
        w={isSidebarOpen ? '220px' : '60px'}
        bg="#222D31"
        color="white"
        transition="0.3s"
        display={isMobile && !isSidebarOpen ? 'none' : 'block'}
      >
        <Flex
          align="center"
          justify="center"
          h="60px"
          borderBottom={`1px solid ${Colors.borderPrimary}`}
        >
          <Text fontWeight="bold">
            {isSidebarOpen ? 'Ronald Gustavo' : 'RG'}
          </Text>
        </Flex>

        <Flex direction="column" p={4} gap={3}>
          <Text cursor="pointer">Dashboard</Text>
          <Text cursor="pointer">Survey</Text>
          <Text cursor="pointer">Report</Text>
        </Flex>
      </Box>

      {/* MAIN */}
      <Flex direction="column" flex="1">
        <Box ref={topRef} />

        <Box position="sticky" top={0} zIndex={10} bg="white">
          <Flex
            h="60px"
            align="center"
            justify="space-between"
            px={4}
            borderBottom={`1px solid ${Colors.borderPrimary}`}
          >
            <Flex align="center" gap={3}>
              <IconButton
                aria-label="toggle sidebar"
                onClick={toggleSidebar}
                variant="ghost"
              >
                <FaBars />
              </IconButton>

              <Heading size="sm">{breadcrumb || 'Dashboard'}</Heading>
            </Flex>

            <MenuRoot>
              <MenuTrigger asChild>
                <Flex align="center" gap={2} cursor="pointer">
                  <FaUserCircle size={32} />

                  <Box textAlign="left">
                    <Text fontSize="sm" fontWeight="600">
                      Nama User
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Admin
                    </Text>
                  </Box>
                </Flex>
              </MenuTrigger>

              <MenuPositioner>
                <MenuContent>
                  <MenuItem value="logout" onClick={handleSignOut}>
                    <Flex align="center" gap={2}>
                      <RiLoginBoxLine />
                      <Text>Logout</Text>
                    </Flex>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </Flex>
        </Box>

        <Flex flex="1" direction="column" overflow="auto">
          <Flex as="main" p={4} flex="1">
            <Outlet />
          </Flex>

          <Footer />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PageBase;
