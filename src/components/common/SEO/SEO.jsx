import { useEffect } from "react";

const SEO = ({ title, description }) => {
  useEffect(() => {
    // App Name constant
    const APP_NAME = "Nexo";

    // Update Document Title
    const fullTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
    document.title = fullTitle;

    // Update Meta Description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};

export default SEO;
