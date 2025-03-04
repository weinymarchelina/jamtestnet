"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container, Paper, Typography, Link } from "@mui/material";
import { db, BlockRecord } from "@/db/db";
import { LabeledRow } from "@/components/display/LabeledRow"; // For non-extrinsic rows
import ExtrinsicAccordion from "@/components/extrinsic/ExtrinsicAccordion";

export default function ExtrinsicDetails() {
  const params = useParams();
  const headerHash = params.headerHash as string;

  const [blockRecord, setBlockRecord] = useState<BlockRecord | null>(null);

  useEffect(() => {
    if (headerHash) {
      db.blocks
        .where("headerHash")
        .equals(headerHash)
        .first()
        .then((record) => {
          console.log("Block record loaded from DB:", record);
          setBlockRecord(record || null);
        })
        .catch((error) => {
          console.error("Error loading block record:", error);
        });
    }
  }, [headerHash]);

  if (!blockRecord) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4">Extrinsics Details</Typography>
          <Typography variant="body1">Loading extrinsics details...</Typography>
        </Paper>
      </Container>
    );
  }

  // Use blockRecord.block based on the new DB scheme.
  const block = blockRecord.block;
  const extrinsic = block.extrinsic;

  // Mapping for non-extrinsic details
  const detailsMapping = [
    {
      label: "Header Hash:",
      tooltip: "The unique hash of the block header.",
      value: (
        <Link href={`/block/${blockRecord.headerHash}`}>
          {blockRecord.headerHash}
        </Link>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography
          variant="h5"
          sx={{ mb: 3, fontWeight: "bold" }}
          gutterBottom
        >
          Extrinsics Details
        </Typography>

        {detailsMapping.map((item, idx) => (
          <LabeledRow
            key={idx}
            label={item.label}
            tooltip={item.tooltip}
            value={item.value}
          />
        ))}

        {/* Extrinsic Accordion Component */}
        <ExtrinsicAccordion
          extrinsic={extrinsic || null}
          headerHash={headerHash}
          initialExtrinsicExpanded={true}
        />
      </Paper>
    </Container>
  );
}
