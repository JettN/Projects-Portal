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
                    { label: "Showcase Description", name: "body", widget: "markdown" },
                    { label: "Winning Project Title", name: "winner_title", widget: "string" },
                    { label: "Winning Project Image", name: "winner_image", widget: "image" },
                    { label: "Winning Project Description", name: "winner_description", widget: "text" }
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
                { label: "Status", name: "status", widget: "select", options: ["active", "planned", "past"]},
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