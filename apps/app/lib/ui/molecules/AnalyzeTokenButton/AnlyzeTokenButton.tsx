import { Button, TooltipContainer } from '../../atoms';

import { useState } from 'react';
import { ButtonProps } from '@radix-ui/themes';
import { agentService, makeid } from '@/core';
import AnalyzeTokenModal from '../AnalyzeTokenModal/AnalyzeTokenModal';

type Props = {
  token?: any;
  tooltipContent: string;
  children: React.ReactNode;
  walletAddress?: string;
  reviewFrequency?: string;
  riskLevel?: string;
  investmentObjective?: string;
  buttonProps?: ButtonProps;
};

const AnalyzeTokenButton = ({
  children,
  token,
  walletAddress,
  reviewFrequency,
  riskLevel,
  investmentObjective,
  tooltipContent,
  buttonProps,
}: Props) => {
  const [openAnalyzeModal, setOpenAnalyzeModal] = useState<boolean>(false);

  const prompt = `RECOMMEND ACTION for TOKEN $${token.symbol} for wallet address ${walletAddress} with ${reviewFrequency?.toUpperCase()} check frequency, ${riskLevel?.toUpperCase()} risk, and ${investmentObjective?.toUpperCase()} investment objective`;

  return (
    <TooltipContainer
      tooltipId={`${token?.chainId || makeid(3)}-${token?.name || makeid(3)}-Analyze`}
      tooltipContent={tooltipContent}>
      <Button
        {...buttonProps}
        onClick={async () => {
          const response = await agentService.sendMessage(
            'f8b5e449-301b-0502-bc57-9569416b1046',
            prompt
          );
          console.log(response);
          setOpenAnalyzeModal(true);
        }}
        size={'2'}
        color="teal">
        {children}
      </Button>
      <AnalyzeTokenModal
        token={token}
        open={openAnalyzeModal}
        walletAddress={walletAddress}
        handleOpen={open => setOpenAnalyzeModal(open)}
      />
    </TooltipContainer>
  );
};

export default AnalyzeTokenButton;
