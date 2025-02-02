export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            Built with ❤️ by{" "}
            <a
              href="https://github.com/thesushilsharma"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              Sushil Sharma
            </a>
          </p>
          <p className="mt-2 text-sm">
            View the source code on{" "}
            <a
              href="https://github.com/thesushilsharma/Interlock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              GitHub
            </a>
          </p>
          <p className="text-sm">
            &copy; {currentYear}. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }