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
import { FaBars, FaUserCircle, FaTimes } from 'react-icons/fa';

import Footer from '../Footer/Footer';
import { useAppDispatch, useAppSelector } from '../../config/hook';
import { logout } from '../../features/auth/AuthSlice';
import useDeviceType from '../../utils/useDeviceType';
import Colors from '../../constant/color';
import { Menu } from '../../constant/menu';
import { logoutApi } from '../../features/auth/AuthService';
import { clearAuthSession, getAuthToken } from '../../utils/authToken';

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
  const walletBalance = useAppSelector((state) => state.wallet.walletBalance);

  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => pathname === path;

  const breadcrumb = pathname
    .split('/')
    .filter(Boolean)
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1))
    .join(' / ');

  const finishLogout = () => {
    clearAuthSession();
    dispatch(logout());
    navigate('/sign-in', { replace: true });
  };

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await logoutApi();
    } finally {
      finishLogout();
    }
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
      const token = getAuthToken();
      if (!token) {
        finishLogout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate, dispatch]);

  return (
    <Flex h="100vh" bg={Colors.bgPrimary} overflow="hidden">
      {/* //NOTE - Sidebar */}
      <Box
        w={isMobile ? '0px' : isSidebarOpen ? '280px' : '90px'}
        bg={`linear-gradient(180deg, ${Colors.sidebarBg} 0%, #000000 100%)`}
        color="white"
        transition="width 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
        overflow="hidden"
        position={isMobile ? 'absolute' : 'relative'}
        zIndex={isMobile ? 20 : 1}
        height="100vh"
        boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.3)"
        display="flex"
        flexDirection="column"
      >
        <Flex
          align="center"
          justify="space-between"
          h="80px"
          px={isSidebarOpen ? 5 : 4}
          borderBottom={`1px solid rgba(255, 255, 255, 0.1)`}
        >
          <Flex align="center" gap={3}>
            <Box
              w={12}
              h={12}
              borderRadius="10px"
              bg={`linear-gradient(135deg, ${Colors.primary} 0%, ${Colors.info} 100%)`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="20px"
              fontWeight="700"
              boxShadow={`0 4px 12px 0 ${Colors.primary}40`}
            >
              💳
            </Box>
            {isSidebarOpen && (
              <Flex direction="column">
                <Text fontSize="sm" fontWeight="800" letterSpacing="-0.5px">
                  Ronald Payment
                </Text>
                <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" mt={-1}>
                  FE Engineer
                </Text>
              </Flex>
            )}
          </Flex>
          {isMobile && isSidebarOpen && (
            <IconButton
              aria-label="close sidebar"
              onClick={handleToggleSidebar}
              variant="ghost"
              color="white"
              size="sm"
            >
              <FaTimes />
            </IconButton>
          )}
        </Flex>

        <Flex
          direction="column"
          px={isSidebarOpen ? 4 : 2}
          py={4}
          gap={2}
          flex={1}
          overflowY="auto"
        >
          <Text
            fontSize="xs"
            fontWeight="700"
            textTransform="uppercase"
            letterSpacing="1px"
            color="rgba(255, 255, 255, 0.4)"
            px={3}
            mb={2}
          >
            {isSidebarOpen ? 'Main Menu' : ''}
          </Text>

          {Menu.filter((item) => item.roles.includes(userRole)).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Flex
                key={item.path}
                align="center"
                gap={4}
                cursor="pointer"
                px={3}
                py={3}
                borderRadius="10px"
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setSidebarOpen(false);
                }}
                bg={active ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}
                color={active ? 'white' : 'rgba(226, 232, 240, 0.7)'}
                transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                position="relative"
                _hover={{
                  bg: 'rgba(59, 130, 246, 0.1)',
                  color: 'white',
                }}
              >
                {active && (
                  <Box
                    position="absolute"
                    left={0}
                    top={0}
                    bottom={0}
                    w="4px"
                    bg={`linear-gradient(180deg, ${Colors.primary} 0%, ${Colors.info} 100%)`}
                    borderRadius="0 10px 10px 0"
                  />
                )}

                <Box
                  fontSize="20px"
                  transition="transform 0.2s ease"
                  transform={active ? 'scale(1.1)' : 'scale(1)'}
                  w={6}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon />
                </Box>

                {isSidebarOpen && (
                  <Text
                    fontSize="sm"
                    fontWeight={active ? '700' : '500'}
                    whiteSpace="nowrap"
                  >
                    {item.label}
                  </Text>
                )}

                {active && isSidebarOpen && (
                  <Box
                    position="absolute"
                    right={3}
                    w="2px"
                    h="2px"
                    borderRadius="50%"
                    bg={Colors.primary}
                    animation="pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                  />
                )}
              </Flex>
            );
          })}
        </Flex>

        {isSidebarOpen && userRole === 'Merchant' && (
          <Box
            px={4}
            py={4}
            borderTop={`1px solid rgba(255, 255, 255, 0.1)`}
            bg="rgba(0, 0, 0, 0.3)"
          >
            <Box
              bg="rgba(59, 130, 246, 0.1)"
              p={3}
              borderRadius="10px"
              border={`1px solid rgba(59, 130, 246, 0.2)`}
            >
              <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)" mb={2}>
                Balance
              </Text>
              <Text fontSize="lg" fontWeight="700">
               Rp. {walletBalance}
              </Text>
            </Box>
          </Box>
        )}
      </Box>

      {/* //NOTE - Content */}
      <Flex direction="column" flex="1" overflow="hidden">
        <Box ref={topRef} />

        <Box
          position="sticky"
          top={0}
          zIndex={10}
          bg={Colors.white}
          borderBottom={`1px solid ${Colors.borderPrimary}`}
          boxShadow="0 1px 3px 0 rgba(0, 0, 0, 0.05)"
        >
          <Flex h="70px" align="center" justify="space-between" px={6}>
            <Flex align="center" gap={4}>
              <IconButton
                aria-label="toggle sidebar"
                onClick={handleToggleSidebar}
                variant="ghost"
                size="md"
                color={Colors.textPrimary}
                _hover={{ bg: Colors.bgSecondary }}
              >
                <FaBars />
              </IconButton>

              <Heading
                size="md"
                color={Colors.textPrimary}
                fontWeight="600"
                letterSpacing="-0.5px"
              >
                {breadcrumb || 'Dashboard'}
              </Heading>
            </Flex>

            <MenuRoot>
              <MenuTrigger asChild>
                <Flex
                  align="center"
                  gap={3}
                  cursor="pointer"
                  px={3}
                  py={2}
                  borderRadius="8px"
                  transition="all 0.2s ease"
                  _hover={{ bg: Colors.bgSecondary }}
                >
                  <Box
                    p={1}
                    borderRadius="8px"
                    bg={Colors.primaryLight}
                    color={Colors.primary}
                    fontSize="20px"
                  >
                    <FaUserCircle />
                  </Box>

                  <Box textAlign="left">
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={Colors.textPrimary}
                    >
                      {userName}
                    </Text>
                    <Text fontSize="xs" color={Colors.textSecondary}>
                      {userRole}
                    </Text>
                  </Box>
                </Flex>
              </MenuTrigger>

              <MenuPositioner>
                <MenuContent
                  bg={Colors.white}
                  borderRadius="8px"
                  boxShadow={Colors.cardShadowHover}
                >
                  <MenuItem
                    value="logout"
                    onClick={handleSignOut}
                    disabled={isLoggingOut}
                  >
                    <Flex align="center" gap={2} color={Colors.textPrimary}>
                      <RiLoginBoxLine />
                      <Text>{isLoggingOut ? 'Logging out...' : 'Logout'}</Text>
                    </Flex>
                  </MenuItem>
                </MenuContent>
              </MenuPositioner>
            </MenuRoot>
          </Flex>
        </Box>

        <Flex flex="1" direction="column" overflow="auto" bg={Colors.bgPrimary}>
          <Flex as="main" p={6} flex="1" maxW="100%">
            <Box w="100%">
              <Outlet />
            </Box>
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
