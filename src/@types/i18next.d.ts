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
        pages: string;
        inner: string;
        middle: string;
        outer: string;
        newProject: string;
        newProjectConfirmationMessage: string;
      };
    };
  }
}
