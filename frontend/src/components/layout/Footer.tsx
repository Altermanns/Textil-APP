const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t py-4 mt-5">
      <div className="container mx-auto text-center text-sm text-gray-500">
        © {currentYear} TextilApp
      </div>
    </footer>
  );
};

export default Footer;
