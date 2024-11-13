"""delete user profile img path

Revision ID: 8778d8ea6331
Revises: 290a368d2d6c
Create Date: 2024-11-14 01:26:58.463312

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8778d8ea6331'
down_revision: Union[str, None] = '290a368d2d6c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('users', 'profile_img_path')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('profile_img_path', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###