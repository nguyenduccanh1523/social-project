// Map màu cố định cho từng tag
export const tagColorMap = {
  Education: {
    primary: '#3B82F6',
    light: '#EFF6FF', 
    border: '#BFDBFE',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  },
  Technology: {
    primary: '#F59E0B',
    light: '#FFFBEB',
    border: '#FCD34D',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
  },
  Business: {
    primary: '#8B5CF6',
    light: '#F5F3FF',
    border: '#DDD6FE',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  },
  Travel: {
    primary: '#EC4899',
    light: '#FDF2F8',
    border: '#FBCFE8',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
  },
  Health: {
    primary: '#10B981',
    light: '#ECFDF5',
    border: '#A7F3D0',
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
  },
  Food: {
    primary: '#F97316',
    light: '#FFF7ED',
    border: '#FDBA74',
    gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
  },
  Entertainment: {
    primary: '#06B6D4',
    light: '#ECFEFF',
    border: '#A5F3FC',
    gradient: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)'
  },
  sercurity: {
    primary: '#EF4444',
    light: '#FEF2F2',
    border: '#FECACA',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)'
  },
  Environment: {
    primary: '#44ef44',
    light: '#FEF2F2',
    border: '#FECACA',
    gradient: 'linear-gradient(135deg,rgb(68, 239, 68) 0%,rgb(38, 220, 47) 100%)'
  },
  Finance: {
    primary: '#d4d412',
    light: '#FEF2F2',
    border: '#FECACA',
    gradient: 'linear-gradient(135deg,rgb(68, 239, 68) 0%,rgb(38, 220, 47) 100%)'
  },
  Lifestyle: {
    primary: '#d412d4',
    light: '#FEF2F2',
    border: '#FECACA',
    gradient: 'linear-gradient(135deg,rgb(68, 239, 68) 0%,rgb(38, 220, 47) 100%)'
  },
  // Màu mặc định cho các tag khác
  default: {
    primary: '#6B7280',
    light: '#F9FAFB',
    border: '#E5E7EB',
    gradient: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)'
  }
};

// Icon cho từng loại tag - Sử dụng Ant Design icons
export const tagIcons = {
    Life: "SmileOutlined",
    Technology: "LaptopOutlined",
    Health: "HeartOutlined",
    Business: "BankOutlined",
    Travel: "GlobalOutlined",
    Food: "CoffeeOutlined",
    Sports: "TrophyOutlined",
    Education: "BookOutlined",
    Entertainment: "PlayCircleOutlined",
    News: "FileTextOutlined",
    Science: "ExperimentOutlined",
    Art: "BgColorsOutlined",
    Music: "SoundOutlined",
    Fashion: "SkinOutlined",
    Lifestyle: "SunOutlined",
    Gaming: "RocketOutlined",
    Finance: "DollarOutlined",
    Photography: "CameraOutlined",
    Environment: "LeafOutlined",
    sercurity: "SettingOutlined",
    // Thêm các tag khác tại đây
    default: "TagOutlined" // Icon mặc định
  };
  