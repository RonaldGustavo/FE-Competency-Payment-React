import { useMediaQuery } from '@chakra-ui/react'

export default function useDeviceType (): DeviceHook {
const [isMobile] = useMediaQuery(['(max-width: 768px)'])
const [isTab] = useMediaQuery(['(max-width: 1024px)'])

  return ({
    isMobile,
    isTab
  })
}

interface DeviceHook {
  isMobile: boolean
  isTab: boolean
}
