# CSC Database App

A Progressive Web App (PWA) for searching and viewing CSC (Common Service Center) VLE details across India.

## Features

- 🔍 **Advanced Search** - Search by CSC ID, VLE Name, District, State
- 🎯 **Smart Filters** - Filter by State, District, Gender
- 📊 **Real-time Stats** - View total records, filtered results, states, and districts
- 📱 **Mobile Friendly** - Responsive design works on all devices
- 📞 **Quick Actions** - Click-to-call and click-to-email functionality
- 💾 **Offline Support** - Works offline after first load
- 📲 **Installable** - Can be installed as a native app on mobile devices

## Data Source

Connected to Google Sheets with 45,000+ CSC records including:
- CSC ID and VLE details
- Contact information (phone, email)
- Location data (State, District, Block, Village)
- Transaction status
- Rollout information

## Installation

### As Web App
Simply visit the deployed URL and start using immediately.

### As Mobile App (APK)
1. Open the app in Chrome on Android
2. Tap the menu (⋮) and select "Install app" or "Add to Home Screen"
3. The app will be installed like a native Android app

### Convert to APK
Use tools like:
- **PWA Builder** (https://www.pwabuilder.com/)
- **Bubblewrap** (Google's PWA to APK tool)
- **TWA (Trusted Web Activity)** via Android Studio

## Usage

1. **Search**: Type in the search box to find CSC by ID, name, or location
2. **Filter**: Use dropdown filters for State, District, Gender
3. **View Details**: Each card shows complete VLE information
4. **Contact**: Click phone numbers to call or email buttons to send emails
5. **Navigate**: Use pagination to browse through results

## Tech Stack

- Pure HTML5, CSS3, JavaScript (No frameworks)
- Google Sheets API for data
- Service Worker for offline functionality
- Progressive Web App (PWA) standards

## Deployment

Deploy to any static hosting service:
- GitHub Pages
- Vercel
- Netlify
- Railway
- Firebase Hosting

## Configuration

To use with your own Google Sheet:
1. Make your sheet publicly viewable
2. Update `SHEET_ID` in `app.js` with your sheet ID
3. Update `SHEET_NAME` if different from "Sheet1"

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

MIT License - Free to use and modify

## Support

For issues or questions, please open an issue on GitHub.