'use client';

import { useEffect } from 'react';

export default function AdminPage() {
  useEffect(() => {
    (async () => {
      // Dynamically import the CMS to ensure it only runs in the browser
      const CMS = (await import('decap-cms-app')).default;

      CMS.init({
        config: {
          // SWITCH TO TEST-REPO FOR LOCAL WORK
          backend: {
            name: 'github',
            repo: 'JettN/Projects-Portal',
            branch: 'main',
            },
            // This is the magic line for local testing
          local_backend: true,
          load_config_file: false,
          media_folder: 'public/images',
          public_folder: '/images',
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
              name: "projects",
              label: "Projects",
              folder: "content/projects",
              create: true,
              slug: "{{slug}}",
              path: "{{slug}}/index",
              fields: [
                { label: "Project Title", name: "title", widget: "string" },
                { label: "Detailed Description", name: "body", widget: "markdown" },
                { label: "Team Members", name: "team", widget: "list" },
                { label: "Project Start Date", name: "start_date", widget: "datetime" },
                { label: "Project Type", name: "type", widget: "select", options: ["Computer Science", "Data Science", "Electrical", "Mechanical", "Other"] },
                { label: "Preview Image", name: "preview_image", widget: "image" }
                // Add remaining fields as needed
              ]
            }
          ],
        },
      });
    })();
  }, []);

  return (
    <>
      <style jsx global>{`
        html, body {
          height: 100%;
          margin: 0;
        }
        #nc-root {
          height: 100vh;
        }
      `}</style>
      <div id="nc-root" />
    </>
  );
}