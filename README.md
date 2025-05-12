# MLMDS Mobile App

A React Native mobile application for managing and tracking baseball/softball training sessions using the MLMDS device.

## Features

- Device Management
- User Profile Settings
- Bat Configuration
- Training Session Tracking
- Performance Analytics
- Data Export and Privacy Controls
- Notification Preferences

## Tech Stack

- React Native
- Expo Router
- TypeScript
- Lucide React Native (Icons)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on iOS or Android:
```bash
npm run ios
# or
npm run android
```

## Project Structure

```
app/
├── (tabs)/          # Tab-based navigation screens
├── settings/        # Settings screens
│   ├── device-info.tsx
│   ├── name.tsx
│   ├── bat-settings.tsx
│   ├── units.tsx
│   ├── notifications.tsx
│   ├── session-history.tsx
│   └── support.tsx
├── components/      # Reusable components
└── constants/       # Theme and configuration constants
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 