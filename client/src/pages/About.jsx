import React from 'react';

export default function About() {
  return (
    <div className='px-4 py-12 max-w-2xl mx-auto '>
      <h1 className='text-3xl font-bold text-center mb-6'>About the Stock Market</h1>
      
      {/* Image Section */}
      <div className='flex justify-center mb-6'>
        <img 
          src='https://img.freepik.com/premium-photo/covid19-stock-market-chart_629685-54940.jpg?w=826' 
          alt='Stock Market Overview' 
          className='rounded-lg shadow-lg w-full h-auto' // Image width increased to 100%
        />
      </div>
      
      <p className='text-lg leading-7 mb-4'>
        The stock market is a crucial component of the global economy, allowing companies to raise capital and investors to own a share of these companies. It is a platform where buyers and sellers come together to trade shares of publicly listed companies. The performance of the stock market is often seen as a barometer of economic health.
      </p>
      <p className='text-lg leading-7 mb-4'>
        Investing in the stock market can provide opportunities for wealth creation, but it also involves risks. Market movements are influenced by various factors such as economic data, company performance, global events, and investor sentiment. Understanding these factors and conducting thorough research is key to making informed investment decisions.
      </p>
      <h2 className='text-2xl font-semibold mt-6 mb-4'>How Our Application Helps</h2>
      <p className='text-lg leading-7 mb-4'>
        Our stock market application is designed to provide you with real-time data, insightful charts, and a personalized experience to manage your investments. Whether you are a seasoned investor or just starting, our platform offers the tools and resources you need to navigate the stock market confidently.
      </p>
      <ul className='list-disc list-inside leading-7'>
        <li>Real-time stock data and market updates</li>
        <li>Customizable watchlists to track your favorite stocks</li>
        <li>Historical data and advanced charting tools</li>
        <li>Secure authentication with social login options</li>
        <li>Alerts and notifications to stay informed about market changes</li>
      </ul>
      <p className='text-lg leading-7 mt-6'>
        Join our community of investors and take control of your financial future with our comprehensive stock market platform.
      </p>
    </div>
  );
}
