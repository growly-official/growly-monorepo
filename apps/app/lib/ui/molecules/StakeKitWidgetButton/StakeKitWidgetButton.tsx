import React, { useState } from 'react';
import { Button, TooltipContainer } from '../../atoms';
import { StakeKitWidgetModal } from '..';
import { ButtonProps } from '@radix-ui/themes';

const StakeKitWidgetButton = ({
  children,
  tooltipContent,
  buttonProps,
}: {
  tooltipContent: string;
  children: React.ReactNode;
  buttonProps?: ButtonProps;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  return (
    <TooltipContainer tooltipId={`stakekit`} tooltipContent={tooltipContent}>
      <Button {...buttonProps} onClick={() => setOpenModal(true)} size={'2'} color="yellow">
        {children}
      </Button>
      <StakeKitWidgetModal open={openModal} handleOpen={open => setOpenModal(open)} />
    </TooltipContainer>
  );
};

export default StakeKitWidgetButton;
