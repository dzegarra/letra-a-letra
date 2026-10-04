import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "custom";
    resources: {
      custom: {
        export: string;
        exportTooltip: string;
        import: string;
        importTooltip: string;
        generatePdf: string;
        generatePdfTooltip: string;
        generatePdfModalTitle: string;
        preview: string;
        table: string;
        cards: string;
        emptyCardsMessage: string;
        totalNumberOfCards: string;
        cardSize: string;
        deleteCard: string;
        areYouSureToDeleteThisCard: string;
        yes: string;
        no: string;
        edit: string;
        ok: string;
        addNewCard: string;
        changeColors: string;
        moveToTheTop: string;
        colorsOfTheCards: string;
        preparingPages: string;
        creatingPdf: string;
        duplex: string;
        duplexTooltip: string;
        displayCardNumber: string;
        cancel: string;
        startCreatingPdf: string;
        zoomIn: string;
        zoomOut: string;
        fitToWidth: string;
        options: string;
        pages: string;
        inner: string;
        middle: string;
        outer: string;
        newProject: string;
        newProjectConfirmationMessage: string;
        wordLength: string;
        sortWordsAscending: string;
        rearDesign: string;
        rearDesign_rings: string;
        rearDesign_rays: string;
        rearDesign_dots: string;
        rearDesign_stars: string;
        rearDesign_plain: string;
        install: string;
        installTooltip: string;
        updateAvailable: string;
        updateAvailableDescription: string;
        update: string;
        more: string;
        language: string;
        inputWord: string;
        tapToWrite: string;
      };
    };
  }
}
