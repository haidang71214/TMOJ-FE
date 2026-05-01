export interface AiDebugRequest {
  submissionId: string;
  languageCode?: string | null;
  resultId?: string | null;
}

export interface AiDebugResponse {
  data: {
    succeeded: boolean;
    code: string;
    message: string;
    data: {
      debugSessionId: string;
      source: string;
      verdictCode: string;
      resultStatusCode: string;
      summary: string;
      suspectedIssueCode: string;
      confidence: number;
      sections: Array<{
        title: string;
        contentMd: string;
      }>;
      safetyNote: string;
      createdAt: string;
    };
  };
  message: string | null;
  traceId: string;
}

export interface AiEditorialRequest {
  problemId: string;
  includeComplexity?: boolean | null;
  includeCorrectness?: boolean | null;
  includePseudocode?: boolean | null;
  languageCode?: string | null;
  styleCode?: string | null;
  targetAudienceCode?: string | null;
}

export interface AiEditorialResponse {
  data: {
    succeeded: boolean;
    code: string;
    message: string;
    data: {
      draftId: string;
      problemId: string;
      draftStatusCode: string;
      languageCode: string;
      styleCode: string;
      title: string;
      contentMd: string;
      outline: {
        sections: string[];
      };
      warnings: string[];
      createdAt: string;
    };
  };
  message: string | null;
  traceId: string;
}
