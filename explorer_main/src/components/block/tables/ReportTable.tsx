"use client";

import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import {
  Report,
  Context,
  PackageSpec,
  Result,
  SegmentRootLookup,
} from "@/types"; // adjust the import path as needed
import { LabeledRow } from "@/components/display/LabeledRow";
import { truncateHash } from "@/utils/helper";

// ToggleHash component: displays a truncated hash by default and toggles to full version on click.
interface ToggleHashProps {
  hash: string;
}
const ToggleHash: React.FC<ToggleHashProps> = ({ hash }) => {
  const [expanded, setExpanded] = React.useState(false);
  const handleToggle = () => setExpanded(!expanded);
  return (
    <Typography
      variant="body2"
      onClick={handleToggle}
      sx={{ cursor: "pointer", display: "inline" }}
      title="Click to toggle full hash"
    >
      {expanded ? hash : truncateHash(hash)}
    </Typography>
  );
};

// Display Context information.
export function ContextDisplay({ context }: { context: Context }) {
  return (
    <Box>
      <LabeledRow
        label="Anchor"
        tooltip="Anchor"
        value={<ToggleHash hash={context.anchor} />}
      />
      <LabeledRow
        label="State Root"
        tooltip="State Root"
        value={<ToggleHash hash={context.state_root} />}
      />
      <LabeledRow
        label="Beefy Root"
        tooltip="Beefy Root"
        value={<ToggleHash hash={context.beefy_root} />}
      />
      <LabeledRow
        label="Lookup Anchor"
        tooltip="Lookup Anchor"
        value={<ToggleHash hash={context.lookup_anchor} />}
      />
      <LabeledRow
        label="Lookup Anchor Slot"
        tooltip="Lookup Anchor Slot"
        value={context.lookup_anchor_slot.toString()}
      />
      {context.prerequisites && context.prerequisites.length > 0 && (
        <LabeledRow
          label="Prerequisites"
          tooltip="Prerequisites"
          value={context.prerequisites.join(", ")}
        />
      )}
    </Box>
  );
}

// Display PackageSpec information.
function PackageSpecDisplay({ packageSpec }: { packageSpec: PackageSpec }) {
  return (
    <Box>
      <LabeledRow
        label="Hash"
        tooltip="Package hash"
        value={<ToggleHash hash={packageSpec.hash} />}
      />
      <LabeledRow
        label="Length"
        tooltip="Package length"
        value={packageSpec.length.toString()}
      />
      <LabeledRow
        label="Erasure Root"
        tooltip="Erasure root"
        value={<ToggleHash hash={packageSpec.erasure_root} />}
      />
      <LabeledRow
        label="Exports Root"
        tooltip="Exports root"
        value={<ToggleHash hash={packageSpec.exports_root} />}
      />
      <LabeledRow
        label="Exports Count"
        tooltip="Exports count"
        value={packageSpec.exports_count.toString()}
      />
    </Box>
  );
}

// Display a single Result.
function ResultDisplay({ result, index }: { result: Result; index: number }) {
  return (
    <Box sx={{ borderBottom: "3px solid #eee", borderRadius: 1, p: 1, mb: 1 }}>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Result {index}
      </Typography>
      <LabeledRow
        label="Service ID"
        tooltip="Service ID"
        value={result.service_id.toString()}
      />
      <LabeledRow
        label="Code Hash"
        tooltip="Code Hash"
        value={<ToggleHash hash={result.code_hash} />}
      />
      <LabeledRow
        label="Payload Hash"
        tooltip="Payload Hash"
        value={<ToggleHash hash={result.payload_hash} />}
      />
      <LabeledRow
        label="Accumulate Gas"
        tooltip="Accumulate Gas"
        value={result.accumulate_gas.toString()}
      />
      <LabeledRow
        label="Result"
        tooltip="Result"
        value={result.result.ok || "N/A"}
      />
    </Box>
  );
}

// Display a list of Results.
function ResultsDisplay({ results }: { results: Result[] }) {
  return (
    <Box>
      {results.map((result, idx) => (
        <ResultDisplay key={idx} result={result} index={idx} />
      ))}
    </Box>
  );
}

// Display a list of SegmentRootLookup.
function SegmentRootLookupDisplay({
  lookups,
}: {
  lookups: SegmentRootLookup[];
}) {
  return (
    <Box>
      {lookups.map((lookup, idx) => (
        <Box
          key={idx}
          sx={{ border: "1px solid #eee", borderRadius: 1, p: 1, mb: 1 }}
        >
          <LabeledRow
            label="Segment Tree Root"
            tooltip="Segment Tree Root"
            value={<ToggleHash hash={lookup.segment_tree_root} />}
          />
          <LabeledRow
            label="Work Package Hash"
            tooltip="Work Package Hash"
            value={<ToggleHash hash={lookup.work_package_hash} />}
          />
        </Box>
      ))}
    </Box>
  );
}

interface ReportTableProps {
  data: Report;
  idx?: number;
  timeout?: number;
}

export default function ReportTable({ data, idx, timeout }: ReportTableProps) {
  // Reusable custom AccordionSummary style
  const customAccordionSummary = (title: string, tooltipText: string) => (
    <AccordionSummary
      sx={{
        px: 0,
        py: 0.75,
        minHeight: "auto",
        "& .MuiAccordionSummary-content": { m: 0, p: 0 },
        cursor: "default",
      }}
      expandIcon={<ExpandMoreIcon />}
    >
      <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <Tooltip title={tooltipText} sx={{ ml: 0.5, mr: 1.5 }}>
          <InfoOutlinedIcon fontSize="small" />
        </Tooltip>
        <Typography
          variant="body1"
          sx={{ whiteSpace: "nowrap", minWidth: "170px" }}
        >
          {title}
        </Typography>
      </Box>
    </AccordionSummary>
  );

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {timeout ? (
          <Typography variant="body1">
            Report {idx} - Timeout {timeout}
          </Typography>
        ) : (
          <Typography variant="body1">Report {idx}</Typography>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {/* Simple fields */}
        <LabeledRow
          label="Auth Output"
          tooltip="Authentication output"
          value={data.auth_output}
        />
        <LabeledRow
          label="Authorizer Hash"
          tooltip="Authorizer hash"
          value={<ToggleHash hash={data.authorizer_hash} />}
        />
        <LabeledRow
          label="Core Index"
          tooltip="Core index value"
          value={data.core_index.toString()}
        />

        {/* Sub-accordion for Context */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            mt: 2,
            mb: 1,
            px: 0,
          }}
        >
          {customAccordionSummary("Context", "Context details")}
          <AccordionDetails sx={{ px: 0 }}>
            <ContextDisplay context={data.context} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Package Spec */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            mb: 1,
            px: 0,
          }}
        >
          {customAccordionSummary(
            "Package Spec",
            "Package specification details"
          )}
          <AccordionDetails sx={{ px: 0 }}>
            <PackageSpecDisplay packageSpec={data.package_spec} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Results */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            mb: 1,
            px: 0,
          }}
        >
          {customAccordionSummary("Results", "Results details")}
          <AccordionDetails sx={{ px: 0 }}>
            <ResultsDisplay results={data.results} />
          </AccordionDetails>
        </Accordion>

        {/* Sub-accordion for Segment Root Lookup */}
        <Accordion
          sx={{
            border: "none",
            boxShadow: "none",
            "&:before": { display: "none" },
            px: 0,
          }}
        >
          {customAccordionSummary(
            "Segment Root Lookup",
            "Segment root lookup details"
          )}
          <AccordionDetails sx={{ px: 0 }}>
            <SegmentRootLookupDisplay lookups={data.segment_root_lookup} />
          </AccordionDetails>
        </Accordion>
      </AccordionDetails>
    </Accordion>
  );
}
