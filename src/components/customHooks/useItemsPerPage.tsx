import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function useItemsPerPage() {
  const isShort = useMediaQuery(`(max-height:700px)`);
  const isMedium1 = useMediaQuery(
    `(min-height:700px) and (max-height:900px)`
  );
  const isMedium2 = useMediaQuery(`(min-height:900px) and (max-height:1100px)`);
  const isMedium3 = useMediaQuery(`(min-height:1100px) and (max-height:1300px)`);
  const isMedium4 = useMediaQuery(`(min-height:1300px) and (max-height:1500px)`);
  const isTall = useMediaQuery(`(min-height:1500px)`);

  if (isShort) return 4;
  if (isMedium1) return 7;
  if (isMedium2) return 10;
  if (isMedium3) return 12;
  if (isMedium4) return 14;
  if (isTall) return 16;
  }