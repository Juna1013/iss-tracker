export default function Footer() {
  return (
    <footer className="mt-12 text-center">
      <p className="text-sm text-gray-500">
        データ提供: Open Notify API | 
        <a 
          href="http://wheretheiss.at/" 
          className="ml-1 text-blue-600 hover:text-blue-800"
          target="_blank" 
          rel="noopener noreferrer"
        >
          Where the ISS at?
        </a>
      </p>
    </footer>
  );
}
