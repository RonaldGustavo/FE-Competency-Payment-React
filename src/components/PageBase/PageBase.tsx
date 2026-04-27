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
import { Menu } from '../../constant/menu';

interface PageBaseProps {
  userName: string;
  userRole: string;
}

function PageBase({ userName, userRole }: PageBaseProps): React.JSX.Element {
  const { isMobile } = useDeviceType();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const topRef = useRef<HTMLDivElement>(null);

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const isActive = (path: string) => pathname === path;

  const breadcrumb = pathname
    .split('/')
    .filter(Boolean)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' / ');

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/sign-in');
  };

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

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

  return (
    <Flex h="100vh" bg={Colors.bgPrimary}>
      <Box
        w={isSidebarOpen ? '220px' : '60px'}
        bg="#222D31"
        color="white"
        transition="0.3s"
        overflow="hidden"
        position={isMobile ? 'absolute' : 'relative'}
        zIndex={isMobile ? 20 : 1}
        height="100vh"
      >
        <Flex
          align="center"
          justify="center"
          h="60px"
          borderBottom={`1px solid ${Colors.borderPrimary}`}
        >
          <Text fontWeight="bold">
            {isSidebarOpen ? 'Ronald Payment' : 'RG'}
          </Text>
        </Flex>

        <Flex direction="column" p={4} gap={3}>
          {Menu.map((item) => {
            const Icon = item.icon;

            return (
              <Flex
                key={item.path}
                align="center"
                gap={3}
                cursor="pointer"
                p={2}
                borderRadius="6px"
                onClick={() => navigate(item.path)}
                bg={isActive(item.path) ? `${Colors.info}` : 'transparent'}
                color={isActive(item.path) ? 'white' : 'gray.300'}
              >
                <Icon />
                {isSidebarOpen && <Text>{item.label}</Text>}
              </Flex>
            );
          })}
        </Flex>
      </Box>

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
            <Flex
              align="center"
              gap={3}
              paddingLeft={isMobile ? (isSidebarOpen ? '0px' : '60px') : '0px'}
            >
              <IconButton
                aria-label="toggle sidebar"
                onClick={handleToggleSidebar}
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
                      {userName}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {userRole}
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

        <Flex
          flex="1"
          direction="column"
          overflow="auto"
          paddingLeft={isMobile ? (isSidebarOpen ? '0px' : '60px') : '0px'}
        >
          <Flex as="main" p={4} flex="1">
            <Outlet />
          </Flex>

          <Footer
            name={userName}
            appVersion={import.meta.env.VITE_APP_VERSION}
          />
        </Flex>
      </Flex>
    </Flex>
  );
}

export default PageBase;
