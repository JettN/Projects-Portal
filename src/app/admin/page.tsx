'use client';

import { useEffect, useRef } from 'react';

export default function AdminPage() {
  const isInitialized = useRef(false);

  useEffect(() => {
    // 1. Initialization Gate
    if (isInitialized.current) return;

    (async () => {
      const CMS = (await import('decap-cms-app')).default;
      
      CMS.init({
        config: {
          backend: {
            //name: 'github',
            //repo: 'JettN/Projects-Portal',
            //branch: 'main',
            name: 'git-gateway', // Required for the proxy to intercept requests
            branch: 'main',
            proxy_url: 'http://localhost:8081/api/v1' // Explicitly point to your proxy
          },
          local_backend: true,
          load_config_file: false,
          media_folder: 'public/images',
          public_folder: '',
          collections: [
            {
              name: "showcase",
              label: "Showcase Page",
              files: [
                {
                  file: "content/showcase/showcase.md",
                  label: "Project Showcase",
                  name: "showcase",
                  fields: [
                    { label: "Showcase Description", name: "showcase_description", widget: "text" },
                    { label: "Showcase Date (YYYY-MM-DDThh:mm:ss)", name: "date", widget: "string" },
                    { label: "Showcase Location", name: "location", widget: "string" },
                    { label: "Winner Blurb", name: "winner_blurb", widget: "text" },
                    { label: "Location Google Map Embed Link", name: "location_link", widget: "string" },
                    { label: "Location Image", name: "location_image", widget: "image" },
                    {
                      label: "FAQs", name: "faqs", widget: "list", min: 3,
                      fields: [
                        { label: "Question", name: "question", widget: "string" },
                        { label: "Answer", name: "answer", widget: "string" },
                      ]
                    },
                    {
                      label: "Sponsors", name: "sponsors", widget: "list",
                      field: { label: "Sponsor Logo", name: "logo", widget: "image" }
                    }
                  ]
                }
                
              ]
            },
            {
              name: "homepage",
              label: "Home Page",
              files: [
                {
                  file: "content/home/homepage.md",
                  label: "Home Page Featured Carousel",
                  name: "homepage",
                  fields: [
                    {
                      label: "Featured Projects",
                      name: "featured_projects",
                      widget: "list",
                      min: 5,
                      field: {
                        label: "Project",
                        name: "project",
                        widget: "relation",
                        collection: "projects",
                        search_fields: ["title"],
                        value_field: "{{slug}}",
                        display_fields: ["title"]
                      }
                    }
                  ]
                }
              ]
            },
            {
              name: "projects",
              label: "Projects",
              folder: "content/projects",
              create: true,
              slug: "{{slug}}",
              path: "{{slug}}/index",
              media_folder: "", 
              public_folder: "",
              fields: [
                { label: "Project Title", name: "title", widget: "string" },
                { label: "Detailed Description", name: "body", widget: "markdown" },
                { label: "Team Members", name: "team", widget: "list" },
                { label: "Project Start Date", name: "start_date", widget: "datetime" },
                { label: "Project Type", name: "type", widget: "select", options: ["Computer Science", "Data Science", "Electrical", "Mechanical", "Other"] },
                { label: "Preview Image", name: "preview_image", widget: "image", media_folder: "./",     public_folder: "./" },
                { label: "Status", name: "status", widget: "select", options: ["active", "past"]},
                { label: "Status", name: "winner_status", widget: "select", options: ["winner", "not winner"]},
                { label: "Keywords", name: "keywords", widget: "list"}
              ]
            }
          ],
        },
      });

      isInitialized.current = true;
    })();

    // 2. The Fix: Manual Cleanup
    return () => {
      const root = document.getElementById('nc-root');
      if (root) {
        // Clear the internal HTML so React can remove the node safely
        root.innerHTML = '';
      }
      isInitialized.current = false;
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Hides error overlays */
        .nextjs-error-overlay, 
        [class*="error-overlay"], 
        nextjs-portal {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Reset the container */
        #nc-root { 
          height: 100vh; 
          width: 100%; 
          position: relative;
          overflow: hidden; /* Prevents double scrollbars */
        }

        /* Force the CMS editor pane to be scrollable */
        #nc-root > div > div > div:nth-child(2) {
          height: calc(100vh - 80px) !important; /* Adjust 80px based on header height */
          overflow-y: auto !important;
          padding-bottom: 40px !important;
        }

        /* Force the header to stay on top */
        #nc-root .cms-top-bar, 
        #nc-root > div > div > div:first-child {
          height: 60px !important;
        }
      `}</style>
      <div id="nc-root" />
    </>
  );
}