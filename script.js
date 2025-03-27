document.addEventListener('DOMContentLoaded', () => {

    // --- Get DOM Elements ---
    const projectGrid = document.getElementById('project-grid');
    const detailViewer = document.getElementById('project-detail-viewer');
    const panels = document.querySelectorAll('.project-panel');
    const closeButtons = document.querySelectorAll('.close-button');
    const homeLink = document.getElementById('home-link');

    // --- Tilt Effect Constants ---
    const tiltIntensity = 8; // Max rotation in degrees

    // --- Function to Close Active Detail View ---
    const closeDetailView = () => {
        const activeDetail = detailViewer?.querySelector('.project-detail-content.active');
        if (activeDetail) {
            activeDetail.classList.remove('active');
            // Use setTimeout matching the CSS transition duration for fade-out
            setTimeout(() => {
                activeDetail.classList.add('hidden');
                projectGrid?.classList.remove('hidden'); // Show grid after detail fades
            }, 500); // Adjust time to match your .project-detail-content transition
        } else {
             projectGrid?.classList.remove('hidden'); // Ensure grid is visible if no detail was open
        }
    };

    // --- Add Listeners to Each Project Panel ---
    panels.forEach(panel => {
        const originalTransition = window.getComputedStyle(panel).transition;

        // --- Tilt Effect Logic ---
        panel.addEventListener('mousemove', (e) => {
            const rect = panel.getBoundingClientRect();
            const width = panel.offsetWidth;
            const height = panel.offsetHeight;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const xDecimal = mouseX / width - 0.5;
            const yDecimal = mouseY / height - 0.5;
            const rotateY = xDecimal * tiltIntensity;
            const rotateX = -yDecimal * tiltIntensity;

            // Apply combined transform (tilt + original hover effect)
            panel.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
            panel.style.transition = 'transform 0.05s ease-out'; // Fast tracking
        });

        panel.addEventListener('mouseleave', () => {
            // Reset transform smoothly
            panel.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            panel.style.transition = originalTransition; // Restore original transition
        });

         panel.addEventListener('mouseenter', () => {
             // Ensure original transition is set on enter for smooth mouseleave
             panel.style.transition = originalTransition;
         });

        // --- Click Handling Logic ---
        panel.addEventListener('click', (e) => {
            // Use e.currentTarget to ensure we're referencing the panel the listener is attached to
            const clickedPanel = e.currentTarget;
            const projectId = clickedPanel.dataset.projectId;

            console.log('Panel clicked:', projectId); // Debugging: Check if click fires

            if (!projectId) {
                console.error('Clicked panel is missing data-project-id');
                return;
            }

            const detailElement = document.getElementById(`${projectId}-detail`);

            if (projectGrid && detailElement && detailViewer) {
                // 1. Hide Grid
                projectGrid.classList.add('hidden');

                // 2. Ensure any other active detail is hidden FIRST (important!)
                const currentlyActive = detailViewer.querySelector('.project-detail-content.active');
                if (currentlyActive && currentlyActive !== detailElement) {
                    currentlyActive.classList.remove('active');
                    currentlyActive.classList.add('hidden');
                }

                // 3. Show the selected detail view
                detailElement.classList.remove('hidden');
                detailViewer.scrollTop = 0; // Scroll to top of detail view

                // 4. Add 'active' class shortly after to trigger CSS transition
                setTimeout(() => {
                    detailElement.classList.add('active');
                }, 10); // Small delay allows 'display' change before transition

            } else {
                console.error(`Could not find elements for project ID: ${projectId}`, { projectGrid, detailElement, detailViewer });
            }
        });
    }); // End panels.forEach

    // --- Close Button Listeners ---
    closeButtons.forEach(button => {
        button.addEventListener('click', closeDetailView);
    });

    // --- Home Link Listener ---
    homeLink?.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent jumping to #
        closeDetailView(); // Close any open project
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll page to top
    });

}); // End DOMContentLoaded