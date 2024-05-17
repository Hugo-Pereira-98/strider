import { ReactNode } from 'react';
import * as rdd from 'react-device-detect';

interface DeviceProps {
	children: (props: typeof rdd) => ReactNode;
}

export default function DeviceContainer({ children }: DeviceProps) {
	return children(rdd);
}
