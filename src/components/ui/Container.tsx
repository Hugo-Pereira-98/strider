import { ComponentPropsWithoutRef } from 'react';
import classNames from 'classnames';

export function Container({ className, children }: ComponentPropsWithoutRef<'div'>) {
	return <div className={classNames('container', className)}>{children}</div>;
}
