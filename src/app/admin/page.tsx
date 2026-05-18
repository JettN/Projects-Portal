'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script'


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
          },
          local_backend: false,
          load_config_file: false,
          show_preview_links: false,
          editor: { preview: false },
          media_folder: '/public/images',
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
                    { label: "Showcase Description", name: "showcase_description", widget: "text" },
                    { label: "Showcase Date (YYYY-MM-DDThh:mm:ss)", name: "date", widget: "string" },
                    { label: "Showcase Location", name: "location", widget: "string" },
                    { label: "Winner Blurb", name: "winner_blurb", widget: "text" },
                    { label: "Location Google Map Embed Link", name: "location_link", widget: "string" },
                    { label: "Location Image", name: "location_image", widget: "image", public_folder: "/",},
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
                    { label: "About Subtitle", name: "about_subtitle", widget: "string", hint: "Heading under 'What is HKN Projects?'" },
                    { label: "About Body", name: "about_body", widget: "text", hint: "Paragraph text under the subtitle" },
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
              name: "resources",
              label: "Resources Page",
              files: [
                {
                  file: "content/resources/resources.md",
                  label: "Resources Page",
                  name: "resources",
                  fields: [
                    {
                      label: "Resource Categories", name: "resource_categories", widget: "list",
                      fields: [
                        { label: "Category Title", name: "title", widget: "string" },
                        {
                          label: "Links", name: "links", widget: "list",
                          fields: [
                            { label: "Label", name: "label", widget: "string" },
                            { label: "URL", name: "url", widget: "string" },
                            { label: "Description", name: "description", widget: "string", required: false }
                          ]
                        }
                      ]
                    },
                    { label: "Contact Email", name: "contact_email", widget: "string" },
                    { label: "Contact LinkedIn", name: "contact_linkedin", widget: "string" },
                    { label: "Contact Instagram", name: "contact_instagram", widget: "string" }
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
                { label: "Documentation Link", name: "doc_link", widget: "string", hint: "URL to the project's documentation page (shown above the image carousel)", required: false },
                { label: "Team Leader", name: "team_leader", widget: "string", hint: "Full name of the team leader (first and last name)", required: false },
                { label: "Team Members", name: "team", widget: "list", field: { label: "Member Name", name: "member", widget: "string", hint: "Enter first and last name" } },
                { label: "Project Start Date", name: "start_date", widget: "datetime" },
                { label: "Project Type", name: "type", widget: "select", options: ["Computer Science", "Data Science", "Electrical", "Mechanical", "Other"] },
                { label: "Team Photo", name: "team_photo", widget: "image", media_folder: "/public/images/projects", public_folder: "/images/projects", hint: "Group photo displayed in the Project Members section", required: false },
                { label: "Preview Image", name: "preview_image", widget: "image", media_folder: "/public/images/projects", public_folder: "/images/projects", hint: "Thumbnail shown on the projects listing page" },
                {
                  label: "Carousel Images",
                  name: "carousel_images",
                  widget: "list",
                  hint: "Add as many documentation/project images as you want — these will appear in the carousel slideshow",
                  field: { label: "Image", name: "image", widget: "image", media_folder: "/public/images/projects", public_folder: "/images/projects" }
                },
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
      <Script 
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="beforeInteractive"
      />
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