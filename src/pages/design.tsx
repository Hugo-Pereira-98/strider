import type { NextPage } from 'next';
import 'tailwindcss/tailwind.css';
import Button from '@/components/Button';
import {
  HiArrowLeft,
  HiArrowRight,
  HiOutlineArchiveBox,
  HiPlusSmall,
} from 'react-icons/hi2';
import Input from '@/components/ui/Input';
import Combobox from '@/components/ui/Combobox';
import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import {
  HiHome,
  HiUserGroup,
  HiBell,
  HiCog6Tooth,
  HiQuestionMarkCircle,
} from 'react-icons/hi2';
import DropDown from '@/components/ui/DropDown';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useState } from 'react';
import { ProgressStepper } from '@/components/ui/ProgressStepper';
import { Pagination } from '@/components/ui/Pagination';
import ToggleButton from '@/components/ui/ToggleButton';
import Toggle from '@/components/ui/Toggle';
import CheckBox from '@/components/ui/CheckBox';
import RadioButton from '@/components/ui/RadioButton';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import Badge from '@/components/ui/Badge';
import IconButton from '@/components/ui/IconButton';
import ProgressBar from '@/components/ui/ProgressBar';
import Tooltip from '@/components/ui/Tooltip';
import Alert from '@/components/ui/Alert';

const Design: NextPage = () => {
  const [toggleValue, setToggleValue] = useState(false);
  const countries = [
    { title: 'United States', supportText: 'US' },
    { title: 'Canada', supportText: 'CA' },
    { title: 'United Kingdom', supportText: 'UK' },
    { title: 'Australia', supportText: 'AU' },
    { title: 'Germany', supportText: 'DE' },
  ];
  const handleSelectCountry = (country: string) => {};

  const sessions = [
    {
      text: 'Home',
      icon: <HiHome className="h-4 w-4 text-neutral-500" />,
    },
    {
      text: 'Groups',
      icon: <HiUserGroup className="h-4 w-4 text-neutral-500" />,
    },
    {
      text: 'Notifications',
      icon: <HiBell className="h-4 w-4 text-neutral-500" />,
    },
    {
      text: 'SessionWithoutIcon',
    },
    {
      text: 'Settings',
      icon: <HiCog6Tooth className="h-4 w-4 text-neutral-500" />,
    },
    {
      text: 'Help',
      icon: <HiQuestionMarkCircle className="h-4 w-4 text-neutral-500" />,
    },
  ];

  const options = [
    {
      title: 'United States',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'Canada',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'United Kingdom',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'Germany',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'France',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'Australia',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'Japan',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'Brazil',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'India',
      leftContent: <HiOutlineExclamationCircle />,
    },
    {
      title: 'South Africa',
      leftContent: <HiOutlineExclamationCircle />,
    },
  ];

  const handleSelect = (value: string) => {
    console.log(`Selected: ${value}`);
  };

  const [progress, setProgress] = useState(0);

  const steps = [
    {
      text: 'Home',
      icon: <HiHome />,
    },
    {
      text: 'Groups',
      icon: <HiUserGroup />,
    },
    {
      text: 'Notifications',
      icon: <HiBell />,
    },
    {
      text: 'Settings',
      icon: <HiCog6Tooth />,
    },
  ];

  const increaseProgress = () => {
    setProgress((prevProgress) => Math.min(prevProgress + 1, steps.length));
  };

  const decreaseProgress = () => {
    setProgress((prevProgress) => Math.max(prevProgress - 1, 0));
  };

  const testArray = [
    { name: 'test' },
    { name: 'test2' },
    { name: 'test3' },
    { name: 'test4' },
    { name: 'test5' },
    { name: 'test6' },
    { name: 'test7' },
    { name: 'test8' },
    { name: 'test9' },
    { name: 'test10' },
    { name: 'test11' },
    { name: 'test12' },
    { name: 'test13' },
    { name: 'test14' },
    { name: 'test15' },
    { name: 'test16' },
    { name: 'test17' },
    { name: 'test18' },
    { name: 'test19' },
    { name: 'test20' },
    { name: 'test21' },
    { name: 'test22' },
    { name: 'test23' },
    { name: 'test24' },
    { name: 'test25' },
  ];

  const [arrayFiltered, setArrayFiltered] = useState(testArray);

  return (
    <></>
    // <div className="flex flex-wrap items-center justify-center h-screen bg-white p-4">
    //   <div className="h-14 w-full flex items-center gap-12 mb-6 p-6">
    //     <p>Normal Styles</p>
    //     <div className="w-10 h-10 shadow-small"></div>
    //     <div className="w-10 h-10 shadow-medium"></div>
    //     <div className="w-10 h-10 shadow-large"></div>
    //   </div>
    //   <div className="h-14 w-full flex items-center gap-12 mb-6 p-6">
    //     <p>Hover Styles</p>
    //     <div className="w-16 h-10 shadow-hover-primary">
    //       <p className="body-extra-small-normal">Primary</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-hover-secondary">
    //       <p className="body-extra-small-normal">Secondary</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-hover-warning">
    //       <p className="body-extra-small-normal">Warning</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-hover-error">
    //       <p className="body-extra-small-normal">Error</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-hover-success">
    //       <p className="body-extra-small-normal">Success</p>
    //     </div>
    //   </div>
    //   <div className="h-14 w-full flex items-center gap-12 mb-6 p-6">
    //     <p>Focused Styles</p>
    //     <div className="w-16 h-10 shadow-focus-primary">
    //       <p className="body-extra-small-normal">Primary</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-focus-secondary">
    //       <p className="body-extra-small-normal">Secondary</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-focus-warning">
    //       <p className="body-extra-small-normal">Warning</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-focus-error">
    //       <p className="body-extra-small-normal">Error</p>
    //     </div>
    //     <div className="w-16 h-10 shadow-focus-success">
    //       <p className="body-extra-small-normal">Success</p>
    //     </div>
    //   </div>

    //   <div className="w-full h-auto flex gap-20 pb-4">
    //     <Button
    //       buttonType="primary"
    //       onClick={() => console.log('')}
    //       label="Primary"
    //     />
    //     <Button
    //       buttonType="secondary"
    //       onClick={() => console.log('')}
    //       label="secondary"
    //     />
    //     <Button
    //       buttonType="secondaryGray"
    //       onClick={() => console.log('')}
    //       label="secondaryGray"
    //     />
    //     <Button
    //       buttonType="textOnly"
    //       onClick={() => console.log('')}
    //       label="textOnly"
    //     />
    //     <Button
    //       buttonType="outline"
    //       onClick={() => console.log('')}
    //       label="outline"
    //     />
    //     <Button
    //       buttonType="danger"
    //       onClick={() => console.log('')}
    //       label="danger"
    //     />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-4">
    //     <Button
    //       disabled
    //       buttonType="primary"
    //       onClick={() => console.log('')}
    //       label="Primary"
    //     />
    //     <Button
    //       disabled
    //       buttonType="secondary"
    //       onClick={() => console.log('')}
    //       label="secondary"
    //     />
    //     <Button
    //       disabled
    //       buttonType="secondaryGray"
    //       onClick={() => console.log('')}
    //       label="secondaryGray"
    //     />
    //     <Button
    //       disabled
    //       buttonType="textOnly"
    //       onClick={() => console.log('')}
    //       label="textOnly"
    //     />
    //     <Button
    //       disabled
    //       buttonType="outline"
    //       onClick={() => console.log('')}
    //       label="outline"
    //     />
    //     <Button
    //       disabled
    //       buttonType="danger"
    //       onClick={() => console.log('')}
    //       label="danger"
    //     />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Button
    //       loading={true}
    //       corners="pill"
    //       buttonType="primary"
    //       onClick={() => console.log('')}
    //       label="Primary"
    //     />
    //     <Button
    //       loading={true}
    //       corners="rounded"
    //       buttonType="primary"
    //       onClick={() => console.log('')}
    //       label="Primary"
    //     />
    //     <Button
    //       loading={true}
    //       corners="sharp"
    //       buttonType="primary"
    //       onClick={() => console.log('')}
    //       label="Primary"
    //     />
    //     <Button
    //       loading={true}
    //       corners="smooth"
    //       buttonType="primary"
    //       onClick={() => console.log('')}
    //       label="Primary"
    //     />
    //   </div>
    //   <div className="w-1/2 h-auto flex gap-6 pb-12">
    //     <Button
    //       label="Click me"
    //       onClick={() => console.log('')}
    //       leftIcon={<HiArrowLeft />}
    //     />
    //     <Button
    //       label="Click me"
    //       onClick={() => console.log('')}
    //       leftIcon={<HiArrowLeft />}
    //       rightIcon={<HiArrowRight />}
    //     />
    //     <Button
    //       label="Click me"
    //       onClick={() => console.log('')}
    //       rightIcon={<HiArrowRight />}
    //     />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Input corners="sharp" placeholder="Oi" />
    //     <Input corners="smooth" placeholder="Oi" />
    //     <Input corners="rounded" placeholder="Oi" />
    //     <Input corners="pill" placeholder="Oi" />
    //   </div>

    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Input
    //       feedbackType="success"
    //       feedback="success"
    //       labelText="First Name"
    //       placeholder="Oi"
    //     />
    //     <Input
    //       feedbackType="warning"
    //       feedback="warning"
    //       labelText="First Name"
    //       placeholder="Oi"
    //     />
    //     <Input
    //       feedbackType="error"
    //       feedback="error"
    //       labelText="First Name"
    //       placeholder="Oi"
    //     />
    //     <Input helpText="help text" labelText="First Name" placeholder="Oi" />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Input disabled labelText="First Name" placeholder="Oi" />
    //     <Input disabled labelText="First Name" placeholder="Oi" />
    //     <Input disabled labelText="First Name" placeholder="Oi" />
    //     <Input disabled labelText="First Name" placeholder="Oi" />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Input state="viewOnly" labelText="First Name" placeholder="Oi" />
    //     <Input state="viewOnly" labelText="First Name" placeholder="Oi" />
    //     <Input state="viewOnly" labelText="First Name" placeholder="Oi" />
    //     <Input state="viewOnly" labelText="First Name" placeholder="Oi" />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Input
    //       labelText="Password"
    //       type="password"
    //       strengthIndicator
    //       placeholder="Oi"
    //     />
    //     <Input
    //       labelText="Password"
    //       type="password"
    //       strengthIndicator
    //       placeholder="Oi"
    //       value="asodi"
    //     />
    //     <Input
    //       labelText="Password"
    //       type="password"
    //       strengthIndicator
    //       placeholder="Oi"
    //       value="asodi@"
    //     />
    //     <Input
    //       labelText="Password"
    //       type="password"
    //       strengthIndicator
    //       placeholder="Oi"
    //       value="asodi@A"
    //     />
    //   </div>

    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Input
    //       iconBackground
    //       labelText="Label Text"
    //       trailIcon={<HiOutlineArchiveBox />}
    //       strengthIndicator
    //       placeholder="Oi"
    //     />
    //     <Input
    //       iconBackground
    //       labelText="Label Text"
    //       trailIcon={<HiOutlineArchiveBox />}
    //       leadIcon={<HiOutlineArchiveBox />}
    //       strengthIndicator
    //       placeholder="Oi"
    //     />
    //     <Input
    //       iconBackground
    //       labelText="Label Text"
    //       leadIcon={<HiOutlineArchiveBox />}
    //       strengthIndicator
    //       placeholder="Oi"
    //     />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Input
    //       labelText="Label Text"
    //       trailIcon={<HiOutlineArchiveBox />}
    //       strengthIndicator
    //       placeholder="Oi"
    //     />
    //     <Input
    //       labelText="Label Text"
    //       trailIcon={<HiOutlineArchiveBox />}
    //       leadIcon={<HiOutlineArchiveBox />}
    //       strengthIndicator
    //       placeholder="Oi"
    //     />
    //     <Input
    //       labelText="Label Text"
    //       leadIcon={<HiOutlineArchiveBox />}
    //       strengthIndicator
    //       placeholder="Oi"
    //     />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <ToggleButton
    //       activeValue="On"
    //       inactiveValue="Off"
    //       checked={toggleValue}
    //       onChange={() => setToggleValue(!toggleValue)}
    //     />
    //     <Toggle
    //       value={toggleValue}
    //       onChange={() => setToggleValue(!toggleValue)}
    //     />
    //     <Toggle
    //       value={true}
    //       disabled
    //       onChange={() => setToggleValue(!toggleValue)}
    //     />
    //     <Toggle
    //       value={false}
    //       disabled
    //       onChange={() => setToggleValue(!toggleValue)}
    //     />
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <CheckBox
    //       checkboxStatus={toggleValue}
    //       onChange={() => setToggleValue(!toggleValue)}
    //     />
    //     <CheckBox
    //       corners="rounded"
    //       checkboxStatus={toggleValue}
    //       onChange={() => setToggleValue(!toggleValue)}
    //     />
    //     <CheckBox disabled checkboxStatus={undefined} />
    //     <CheckBox disabled checkboxStatus={true} />
    //     <CheckBox disabled checkboxStatus={false} />
    //   </div>
    //   <div className="w-full h-auto flex pb-12 gap-10">
    //     <div className="h-auto flex gap-2 pb-12">
    //       <RadioButton
    //         radioSize="small"
    //         value={toggleValue}
    //         onChange={() => setToggleValue(!toggleValue)}
    //       />
    //       <RadioButton radioSize="small" disabled value={true} />
    //       <RadioButton radioSize="small" disabled value={false} />
    //     </div>
    //     <div className="h-auto flex gap-2 pb-12">
    //       <RadioButton
    //         value={toggleValue}
    //         onChange={() => setToggleValue(!toggleValue)}
    //       />
    //       <RadioButton disabled value={true} />
    //       <RadioButton disabled value={false} />
    //     </div>
    //     <div className="h-auto flex gap-2 pb-12">
    //       <RadioButton
    //         radioSize="large"
    //         value={toggleValue}
    //         onChange={() => setToggleValue(!toggleValue)}
    //       />
    //       <RadioButton radioSize="large" disabled value={true} />
    //       <RadioButton radioSize="large" disabled value={false} />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex flex-col gap-4 pb-12">
    //     <div className="h-auto flex gap-2">
    //       <Badge color="success" size="sm" corners="sharp" label="label" />
    //       <Badge color="success" size="md" corners="sharp" label="label" />
    //       <Badge color="success" size="lg" corners="sharp" label="label" />
    //       <Badge
    //         leftIcon={<HiArrowLeft />}
    //         color="success"
    //         size="sm"
    //         corners="sharp"
    //         label="label"
    //       />
    //       <Badge
    //         leftIcon={<HiArrowLeft />}
    //         color="success"
    //         size="md"
    //         corners="sharp"
    //         label="label"
    //       />
    //       <Badge
    //         leftIcon={<HiArrowLeft />}
    //         color="success"
    //         size="lg"
    //         corners="sharp"
    //         label="label"
    //       />
    //     </div>
    //     <div className="h-auto flex gap-2 ">
    //       <Badge
    //         color="primary"
    //         badgeType="light"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="primary"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="primary"
    //         badgeType="dark"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="error"
    //         badgeType="light"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="error"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="error"
    //         badgeType="dark"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="warning"
    //         badgeType="light"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="warning"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="warning"
    //         badgeType="dark"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="success"
    //         badgeType="light"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="success"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         color="success"
    //         badgeType="dark"
    //         corners="smooth"
    //         label="label"
    //       />
    //     </div>
    //     <div className="h-auto flex gap-2 ">
    //       <Badge
    //         leftIcon={<HiArrowLeft />}
    //         color="success"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //         size="lg"
    //       />
    //       <Badge
    //         leftIcon={<HiArrowLeft />}
    //         color="success"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         flag="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1024px-Flag_of_Brazil.svg.png"
    //         color="success"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //       />
    //       <Badge
    //         rightIcon={<HiArrowRight size={10} />}
    //         color="success"
    //         badgeType="outlined"
    //         corners="smooth"
    //         label="label"
    //       />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex flex-col gap-4 pb-12">
    //     <div className="h-auto flex gap-6 bg-gray-300 p-6">
    //       <Tooltip
    //         size="small"
    //         pointedArrow="up"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         size="medium"
    //         pointedArrow="up"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         size="large"
    //         pointedArrow="up"
    //         headLineText="Here is a tooltip"
    //       />
    //     </div>
    //     <div className="h-auto flex gap-6 bg-gray-300 p-6">
    //       <Tooltip
    //         size="large"
    //         pointedArrow="none"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         size="medium"
    //         pointedArrow="left"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         size="small"
    //         pointedArrow="down"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip pointedArrow="right" headLineText="Here is a tooltip" />
    //       <Tooltip pointedArrow="up" headLineText="Here is a tooltip" />
    //     </div>
    //     <div className="h-auto flex gap-6 bg-gray-300 p-6">
    //       <Tooltip
    //         background="dark"
    //         pointedArrow="none"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         background="dark"
    //         pointedArrow="left"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         background="dark"
    //         pointedArrow="down"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         background="dark"
    //         pointedArrow="right"
    //         headLineText="Here is a tooltip"
    //       />
    //       <Tooltip
    //         background="dark"
    //         pointedArrow="up"
    //         headLineText="Here is a tooltip"
    //       />
    //     </div>
    //     <div className="h-auto flex gap-6 bg-gray-300 p-6">
    //       <Tooltip
    //         size="small"
    //         background="dark"
    //         pointedArrow="down"
    //         headLineText="Here is a tooltip"
    //         supportingText="Here is some helpful explainer text to assist or guide the user in understanding how a certain feature works."
    //       />
    //       <Tooltip
    //         size="medium"
    //         background="light"
    //         pointedArrow="up"
    //         headLineText="Here is a tooltip"
    //         supportingText="Here is some helpful explainer text to assist or guide the user in understanding how a certain feature works."
    //       />
    //       <Tooltip
    //         size="large"
    //         background="light"
    //         pointedArrow="up"
    //         headLineText="Here is a tooltip"
    //         supportingText="Here is some helpful explainer text to assist or guide the user in understanding how a certain feature works."
    //       />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex flex-col gap-4 pb-12">
    //     <div className="h-auto flex gap-6 bg-gray-300 p-6">
    //       {/* <Alert
    //         headLineText="Alert headline text"
    //         type="primary"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about. Describe what has happened and what changed for the user."
    //       />
    //       <Alert
    //         headLineText="Alert headline text"
    //         type="error"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about. Describe what has happened and what changed for the user."
    //       />
    //       <Alert
    //         headLineText="Alert headline text"
    //         type="warning"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about. Describe what has happened and what changed for the user."
    //       />
    //       <Alert
    //         headLineText="Alert headline text"
    //         type="success"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about. Describe what has happened and what changed for the user."
    //       />
    //       <Alert
    //         headLineText="Alert headline text"
    //         background="dark"
    //         type="primary"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about. Describe what has happened and what changed for the user."
    //       /> */}
    //       {/* <Alert
    //         headLineText="Alert headline text"
    //         background="dark"
    //         type="error"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about. Describe what has happened and what changed for the user."
    //       />
    //       <Alert
    //         headLineText="Alert headline text"
    //         background="dark"
    //         type="warning"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about. Describe what has happened and what changed for the user."
    //       /> */}
    //       <Alert
    //         headLineText="Alert headline text"
    //         background="dark"
    //         type="success"
    //         buttonText="Learn more"
    //         supportingText="Here is some supporting text for the user to better understand what the alert is all about."
    //       />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex flex-col  gap-10">
    //     <div className="h-auto flex gap-2 ">
    //       <SegmentedControl
    //         corners="sharp"
    //         leftIcon={<HiArrowLeft />}
    //         label="label"
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         corners="rounded"
    //         leftIcon={<HiArrowLeft />}
    //         label="label"
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         corners="pill"
    //         leftIcon={<HiArrowLeft />}
    //         label="label"
    //         onClick={() => console.log('')}
    //       />
    //     </div>
    //     <div className="h-auto flex gap-2 ">
    //       <SegmentedControl
    //         corners="pill"
    //         leftIcon={<HiArrowLeft />}
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         corners="pill"
    //         leftIcon={<HiArrowLeft />}
    //         label="label"
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         corners="pill"
    //         rightIcon={<HiArrowRight />}
    //         label="label"
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         corners="pill"
    //         rightIcon={<HiArrowRight />}
    //         onClick={() => console.log('')}
    //       />
    //     </div>
    //     <div className="h-auto flex gap-2 mb-8 ">
    //       <SegmentedControl
    //         disabled
    //         corners="pill"
    //         leftIcon={<HiArrowLeft />}
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         disabled
    //         corners="pill"
    //         leftIcon={<HiArrowLeft />}
    //         label="label"
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         disabled
    //         corners="pill"
    //         rightIcon={<HiArrowRight />}
    //         label="label"
    //         onClick={() => console.log('')}
    //       />
    //       <SegmentedControl
    //         disabled
    //         corners="pill"
    //         rightIcon={<HiArrowRight />}
    //         onClick={() => console.log('')}
    //       />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex flex-col  gap-4">
    //     <div className="h-auto flex gap-2 ">
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //     </div>
    //     <div className="h-auto flex gap-2 ">
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         buttonIconType="dark"
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         buttonIconType="dark"
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         buttonIconType="dark"
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         buttonIconType="dark"
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         buttonIconType="dark"
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         buttonIconType="dark"
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //     </div>
    //     <div className="h-auto flex gap-2">
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         buttonIconType="primary"
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         buttonIconType="primary"
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         buttonIconType="primary"
    //         icon={<HiPlusSmall />}
    //       />
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         buttonIconType="primary"
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         buttonIconType="primary"
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         buttonIconType="primary"
    //         icon={<HiPlusSmall />}
    //         disabled
    //       />
    //     </div>
    //     <div className="h-auto flex gap-2">
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         size="2xs"
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         size="xs"
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         size="sm"
    //       />
    //       <IconButton
    //         corners="sharp"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         size="md"
    //       />
    //       <IconButton
    //         corners="smooth"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         size="lg"
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         size="xl"
    //       />
    //       <IconButton
    //         corners="pill"
    //         onClick={() => console.log('')}
    //         icon={<HiPlusSmall />}
    //         size="2xl"
    //       />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex mt-8 gap-4">
    //     <div className="w-full pt-[6px]">
    //       <ProgressBar indicator={false} percentage={90} />
    //     </div>
    //     <div className="w-full">
    //       <ProgressBar percentage={9} />
    //     </div>
    //     <div className="w-full">
    //       <ProgressBar label="Label" percentage={0} />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex gap-20 pb-12">
    //     <Combobox
    //       options={countries}
    //       onSelect={handleSelectCountry}
    //       labelText="Select a Country"
    //       placeholder="Select a Country"
    //     />
    //     <DropDown
    //       options={options}
    //       onSelect={handleSelect}
    //       labelText="Choose an Option"
    //       placeholder="Select an Option"
    //     />
    //   </div>

    //   <div className="w-full h-auto flex gap-2 pb-12 flex-col">
    //     <div className="flex flex-row gap-10 justify-center">
    //       <Breadcrumbs
    //         type="textIcon"
    //         textPosition="rightIcon"
    //         sessions={sessions}
    //         separator="arrow"
    //       />
    //     </div>
    //     <div className="flex flex-row gap-10 justify-center">
    //       <Breadcrumbs
    //         type="onlyText"
    //         textPosition="rightIcon"
    //         sessions={sessions}
    //         separator="slash"
    //       />
    //     </div>
    //     <div className="flex flex-row gap-10 justify-center">
    //       <Breadcrumbs
    //         type="onlyIcon"
    //         textPosition="rightIcon"
    //         sessions={sessions}
    //         separator="slash"
    //       />
    //     </div>
    //     <div className="flex flex-row gap-10 justify-center">
    //       <Breadcrumbs
    //         type="onlyIcon"
    //         textPosition="rightIcon"
    //         sessions={sessions}
    //         separator="slash"
    //       />
    //     </div>
    //   </div>

    //   <div className="w-full h-auto flex gap-2 pb-12 flex-col items-center">
    //     <div className="w-1/5 gap-12 flex mb-8">
    //       <Button
    //         corners="smooth"
    //         label="Decrease"
    //         onClick={decreaseProgress}
    //       />
    //       <Button
    //         corners="smooth"
    //         label="Increase"
    //         onClick={increaseProgress}
    //       />
    //     </div>
    //     <div className="w-4/5">
    //       <ProgressStepper type="chips" steps={steps} progress={progress} />
    //     </div>
    //     <div className="w-4/5">
    //       <ProgressStepper type="iconText" steps={steps} progress={progress} />
    //     </div>
    //     <div className="w-4/5">
    //       <ProgressStepper type="onlyIcon" steps={steps} progress={progress} />
    //     </div>
    //     <div className="w-4/5">
    //       <ProgressStepper
    //         type="numberText"
    //         steps={steps}
    //         progress={progress}
    //       />
    //     </div>
    //     <div className="w-4/5">
    //       <ProgressStepper
    //         type="onlyNumber"
    //         steps={steps}
    //         progress={progress}
    //       />
    //     </div>
    //   </div>
    //   <div className="w-full h-auto flex gap-2 pb-12 flex-col items-center">
    //     <div className="w-4/5">
    //       <Pagination
    //         itemsPerPage={2}
    //         items={testArray}
    //         onChange={setArrayFiltered}
    //       />
    //     </div>
    //     <div className="w-4/5">
    //       <Pagination
    //         itemsPerPage={2}
    //         items={testArray}
    //         onChange={setArrayFiltered}
    //         nextText="Next"
    //         prevText="Previous"
    //       />
    //     </div>
    //     <div className="w-4/5">
    //       <Pagination
    //         itemsPerPage={2}
    //         items={testArray}
    //         onChange={setArrayFiltered}
    //         corners="pill"
    //       />
    //     </div>
    //     <div className="w-4/5">
    //       <Pagination
    //         buttonType="spacedButtons"
    //         itemsPerPage={2}
    //         items={testArray}
    //         onChange={setArrayFiltered}
    //       />
    //     </div>
    //     <div className="w-4/5">
    //       <Pagination
    //         buttonType="text"
    //         itemsPerPage={2}
    //         items={testArray}
    //         onChange={setArrayFiltered}
    //       />
    //     </div>
    //   </div>

    //   <div className="w-full bg-gray-400 h-auto flex gap-20 pb-12 overflow-x-scroll">
    //     <div>
    //       <h1 className="heading-body-medium">Title Large</h1>
    //       <div className="flex flex-col">
    //         <h1 className="title-large-light">light</h1>
    //         <h1 className="title-large-regular">regular</h1>
    //         <h1 className="title-large-medium">medium</h1>
    //         <h1 className="title-large-semiBold">semiBold</h1>
    //         <h1 className="title-large-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Title Small</h1>
    //       <div className="flex flex-col">
    //         <h1 className="title-small-light"> light</h1>
    //         <h1 className="title-small-regular"> regular</h1>
    //         <h1 className="title-small-medium"> medium</h1>
    //         <h1 className="title-small-semiBold"> semiBold</h1>
    //         <h1 className="title-small-bold"> bold</h1>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="w-full bg-gray-400 h-auto flex gap-4 pb-12 overflow-x-scroll">
    //     <div>
    //       <h1 className="heading-body-medium">Heading Huge</h1>
    //       <div className="flex flex-col">
    //         <h1 className="heading-huge-light"> light</h1>
    //         <h1 className="heading-huge-regular"> regular</h1>
    //         <h1 className="heading-huge-medium"> medium</h1>
    //         <h1 className="heading-huge-semiBold"> semiBold</h1>
    //         <h1 className="heading-huge-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Heading Extra Large</h1>
    //       <div className="flex flex-col">
    //         <h1 className="heading-extra-large-light"> light</h1>
    //         <h1 className="heading-extra-large-regular"> regular</h1>
    //         <h1 className="heading-extra-large-medium"> medium</h1>
    //         <h1 className="heading-extra-large-semiBold"> semiBold</h1>
    //         <h1 className="heading-extra-large-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Heading Large</h1>
    //       <div className="flex flex-col">
    //         <h1 className="heading-large-light"> light</h1>
    //         <h1 className="heading-large-regular"> regular</h1>
    //         <h1 className="heading-large-medium"> medium</h1>
    //         <h1 className="heading-large-semiBold"> semiBold</h1>
    //         <h1 className="heading-large-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Heading Medium</h1>
    //       <div className="flex flex-col">
    //         <h1 className="heading-medium-light"> light</h1>
    //         <h1 className="heading-medium-regular"> regular</h1>
    //         <h1 className="heading-medium-medium"> medium</h1>
    //         <h1 className="heading-medium-semiBold"> semiBold</h1>
    //         <h1 className="heading-medium-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Heading Small</h1>
    //       <div className="flex flex-col">
    //         <h1 className="heading-small-light"> light</h1>
    //         <h1 className="heading-small-regular"> regular</h1>
    //         <h1 className="heading-small-medium"> medium</h1>
    //         <h1 className="heading-small-semiBold"> semiBold</h1>
    //         <h1 className="heading-small-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Heading Extra Small</h1>
    //       <div className="flex flex-col">
    //         <h1 className="heading-extra-small-light"> light</h1>
    //         <h1 className="heading-extra-small-regular"> regular</h1>
    //         <h1 className="heading-extra-small-medium"> medium</h1>
    //         <h1 className="heading-extra-small-semiBold"> semiBold</h1>
    //         <h1 className="heading-extra-small-bold"> bold</h1>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="w-full bg-gray-400 h-auto flex gap-4 pb-12 overflow-x-scroll">
    //     <div>
    //       <h1 className="heading-body-medium">Body Extra Large</h1>
    //       <div className="flex flex-col">
    //         <h1 className="body-extra-large-light"> light</h1>
    //         <h1 className="body-extra-large-regular"> regular</h1>
    //         <h1 className="body-extra-large-medium"> medium</h1>
    //         <h1 className="body-extra-large-semiBold"> semiBold</h1>
    //         <h1 className="body-extra-large-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Body Large</h1>
    //       <div className="flex flex-col">
    //         <h1 className="body-large-light">light</h1>
    //         <h1 className="body-large-regular">regular</h1>
    //         <h1 className="body-large-medium">medium</h1>
    //         <h1 className="body-large-semiBold">semiBold</h1>
    //         <h1 className="body-large-bold">bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Body Medium</h1>
    //       <div className="flex flex-col">
    //         <h1 className="body-medium-light">light</h1>
    //         <h1 className="body-medium-regular">regular</h1>
    //         <h1 className="body-medium-medium">medium</h1>
    //         <h1 className="body-medium-semiBold">semiBold</h1>
    //         <h1 className="body-medium-bold">bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Body Small</h1>
    //       <div className="flex flex-col">
    //         <h1 className="body-small-light">light</h1>
    //         <h1 className="body-small-regular">regular</h1>
    //         <h1 className="body-small-medium">medium</h1>
    //         <h1 className="body-small-semiBold">semiBold</h1>
    //         <h1 className="body-small-bold">bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Body Extra Small</h1>
    //       <div className="flex flex-col">
    //         <h1 className="body-extra-small-light">light</h1>
    //         <h1 className="body-extra-small-regular">regular</h1>
    //         <h1 className="body-extra-small-medium">medium</h1>
    //         <h1 className="body-extra-small-semiBold">semiBold</h1>
    //         <h1 className="body-extra-small-bold">bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Body Tiny</h1>
    //       <div className="flex flex-col">
    //         <h1 className="body-tiny-light">light</h1>
    //         <h1 className="body-tiny-regular">regular</h1>
    //         <h1 className="body-tiny-medium">medium</h1>
    //         <h1 className="body-tiny-semiBold">semiBold</h1>
    //         <h1 className="body-tiny-bold">bold</h1>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="w-full bg-gray-400 h-auto flex gap-4 pb-12 overflow-x-scroll">
    //     <div>
    //       <h1 className="heading-body-medium">Label Extra Large</h1>
    //       <div className="flex flex-col">
    //         <h1 className="label-extra-large-light"> light</h1>
    //         <h1 className="label-extra-large-regular"> regular</h1>
    //         <h1 className="label-extra-large-medium"> medium</h1>
    //         <h1 className="label-extra-large-semiBold"> semiBold</h1>
    //         <h1 className="label-extra-large-bold"> bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Label Large</h1>
    //       <div className="flex flex-col">
    //         <h1 className="label-large-light">light</h1>
    //         <h1 className="label-large-regular">regular</h1>
    //         <h1 className="label-large-medium">medium</h1>
    //         <h1 className="label-large-semiBold">semiBold</h1>
    //         <h1 className="label-large-bold">bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Label Medium</h1>
    //       <div className="flex flex-col">
    //         <h1 className="label-medium-light">light</h1>
    //         <h1 className="label-medium-regular">regular</h1>
    //         <h1 className="label-medium-medium">medium</h1>
    //         <h1 className="label-medium-semiBold">semiBold</h1>
    //         <h1 className="label-medium-bold">bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Label Small</h1>
    //       <div className="flex flex-col">
    //         <h1 className="label-small-light">light</h1>
    //         <h1 className="label-small-regular">regular</h1>
    //         <h1 className="label-small-medium">medium</h1>
    //         <h1 className="label-small-semiBold">semiBold</h1>
    //         <h1 className="label-small-bold">bold</h1>
    //       </div>
    //     </div>
    //     <div>
    //       <h1 className="heading-body-medium">Label Extra Small</h1>
    //       <div className="flex flex-col">
    //         <h1 className="label-extra-small-light">light</h1>
    //         <h1 className="label-extra-small-regular">regular</h1>
    //         <h1 className="label-extra-small-medium">medium</h1>
    //         <h1 className="label-extra-small-semiBold">semiBold</h1>
    //         <h1 className="label-extra-small-bold">bold</h1>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default Design;
